import { exec } from "@actions/exec";

const { GITHUB_REF } = process.env;
const branch = GITHUB_REF?.replace("refs/heads/", "");

export class Git {
  commandsRun = [];

  constructor(gitUserName: string, gitUserEmail: string) {
    // Set config
    this.config("user.name", gitUserName);
    this.config("user.email", gitUserEmail);
  }

  exec = (command: string): Promise<string> =>
    new Promise(async (resolve, reject) => {
      let execOutput = "";

      const options = {
        listeners: {
          stdout: (data: any) => {
            execOutput += data.toString();
          },
        },
      };

      const exitCode = await exec(`git ${command}`, undefined, options);

      if (exitCode === 0) {
        resolve(execOutput);
      } else {
        reject(`Command "git ${command}" exited with code ${exitCode}.`);
      }
    });

  config = (key: string, value: string) =>
    this.exec(`config ${key} "${value}"`);

  add = (file: string) => this.exec(`add ${file}`);

  commit = (message: string) => this.exec(`commit -m "${message}"`);

  pull = async () => {
    const args = ["pull"];

    // Check if the repo is unshallow
    if (await this.isShallow()) {
      args.push("--unshallow");
    }

    args.push("--tags");
    args.push("--ff-only");

    return this.exec(args.join(" "));
  };

  push = () => this.exec(`push origin ${branch} --follow-tags -f`);

  isShallow = async () => {
    const isShallow = await this.exec("rev-parse --is-shallow-repository");

    return isShallow.trim().replace("\n", "") === "true";
  };

  updateOrigin = (repo: string) => this.exec(`remote set-url origin ${repo}`);

  createTag = (tag: string, force: boolean = false) =>
    this.exec(`tag -a ${tag} -m "${tag}" ${force ? "-f" : ""}`);
}
