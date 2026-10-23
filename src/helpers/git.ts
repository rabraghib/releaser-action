import fs from "node:fs";
import path from "node:path";
import { getExecOutput } from "@actions/exec";
import * as core from "@actions/core";

type Refs = Map<string, string>;
export class PublicationUncertainError extends Error {}

function parseRefs(output: string): Refs {
  return new Map(
    output
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => {
        const [object, ref] = line.split(/\s+/);
        return [ref, object];
      }),
  );
}

function refsMatch(expected: Refs, actual: Refs): boolean {
  return [...expected].every(
    ([ref, object]) => (actual.get(ref) ?? "") === object,
  );
}

export class Git {
  private env: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(process.env).filter(
        (entry): entry is [string, string] => entry[1] !== undefined,
      ),
    ),
    GIT_TERMINAL_PROMPT: "0",
    GIT_AUTHOR_NAME: "github-actions[bot]",
    GIT_COMMITTER_NAME: "github-actions[bot]",
    GIT_AUTHOR_EMAIL: "41898282+github-actions[bot]@users.noreply.github.com",
    GIT_COMMITTER_EMAIL:
      "41898282+github-actions[bot]@users.noreply.github.com",
  };
  private remote = "origin";

  constructor(readonly cwd: string) {}

  async exec(args: string[], allowFailure = false): Promise<string> {
    const result = await getExecOutput(
      "git",
      [
        "--literal-pathspecs",
        "-c",
        "commit.gpgSign=false",
        "-c",
        "tag.gpgSign=false",
        "-c",
        `core.hooksPath=${path.join(this.cwd, ".git", "releaser-no-hooks")}`,
        ...args,
      ],
      { cwd: this.cwd, env: this.env, silent: true, ignoreReturnCode: true },
    );

    if (result.exitCode !== 0 && !allowFailure) {
      throw new Error(
        `git ${args[0]} failed (${result.exitCode}): ${result.stdout.trim()} ${result.stderr.trim()}`,
      );
    }
    return result.exitCode === 0 ? result.stdout.trimEnd() : "";
  }

  async authenticate(
    token: string,
    server: string,
    repository: string,
  ): Promise<void> {
    const fetchUrl = await this.exec(["remote", "get-url", "origin"]);
    const pushUrl = await this.exec([
      "remote",
      "get-url",
      "--push",
      "--all",
      "origin",
    ]);
    if (fetchUrl !== pushUrl || pushUrl.split(/\r?\n/).length !== 1) {
      throw new Error("origin must have one matching fetch and push URL");
    }
    this.remote = fetchUrl;
    if (!token) return;

    const host = new URL(server);
    if (
      host.protocol !== "https:" ||
      host.username ||
      host.password ||
      host.search ||
      host.hash ||
      host.pathname !== "/" ||
      !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)
    ) {
      throw new Error("Invalid GITHUB_SERVER_URL or GITHUB_REPOSITORY");
    }
    const repositoryUrl = `${host.origin}/${repository}`;
    if (
      fetchUrl.replace(/\.git$/, "").toLowerCase() !==
      repositoryUrl.toLowerCase()
    ) {
      throw new Error(
        "origin must match GITHUB_SERVER_URL/GITHUB_REPOSITORY; use HTTPS checkout with persist-credentials: false",
      );
    }

    const encodedToken = Buffer.from(`x-access-token:${token}`).toString(
      "base64",
    );
    const authorization = `AUTHORIZATION: basic ${encodedToken}`;
    for (const secret of [token, encodedToken, authorization])
      core.setSecret(secret);
    const configuration = [
      ["http.extraheader", ""],
      [`http.${host.origin}/.extraheader`, ""],
      [`http.${repositoryUrl}.git.extraheader`, ""],
      [`http.${repositoryUrl}.git.extraheader`, authorization],
    ];
    this.env.GIT_CONFIG_COUNT = String(configuration.length);
    configuration.forEach(([key, value], index) => {
      this.env[`GIT_CONFIG_KEY_${index}`] = key;
      this.env[`GIT_CONFIG_VALUE_${index}`] = value;
    });
    this.remote = `${repositoryUrl}.git`;
  }

  async prepare(branch: string): Promise<string> {
    await this.exec(["check-ref-format", `refs/heads/${branch}`]);
    const root = await this.exec(["rev-parse", "--show-toplevel"]);
    if (fs.realpathSync.native(root) !== fs.realpathSync.native(this.cwd)) {
      throw new Error("Run the action at the repository root");
    }
    await this.assertClean();
    const shallow = await this.exec(["rev-parse", "--is-shallow-repository"]);
    await this.exec([
      "fetch",
      "--prune",
      "--no-tags",
      ...(shallow === "true" ? ["--unshallow"] : []),
      "--",
      this.remote,
      `+refs/heads/${branch}:refs/remotes/origin/${branch}`,
      "+refs/tags/*:refs/releaser-action/tags/*",
    ]);
    const head = await this.exec(["rev-parse", "HEAD"]);
    if (
      head !== (await this.exec(["rev-parse", `refs/remotes/origin/${branch}`]))
    ) {
      throw new Error(
        "Checkout is stale or ahead of the remote branch; check out the triggering commit and retry on the latest branch head",
      );
    }
    return head;
  }

  async assertClean(): Promise<void> {
    if (await this.exec(["status", "--porcelain", "--untracked-files=all"])) {
      throw new Error(
        "Release requires a clean working tree and index, including untracked files",
      );
    }
  }

  async validateTag(tag: string): Promise<void> {
    if (!tag || tag.startsWith("-") || tag.length > 240)
      throw new Error(`Invalid tag: ${tag}`);
    await this.exec(["check-ref-format", `refs/tags/${tag}`]);
  }

  async tagObject(tag: string): Promise<string> {
    return this.exec(["rev-parse", "--verify", `refs/tags/${tag}`], true);
  }

  async remoteTags(): Promise<Refs> {
    const refs = parseRefs(
      await this.exec(["ls-remote", "--refs", "--tags", "--", this.remote]),
    );
    return new Map(
      [...refs].map(([ref, object]) => [
        ref.slice("refs/tags/".length),
        object,
      ]),
    );
  }

  async releaseTags(prefix: string, pattern: RegExp): Promise<string[]> {
    const output = await this.exec([
      "for-each-ref",
      "--merged=HEAD",
      "--format=%(refname:strip=3)%09%(*objectname)%09%(objectname)",
      "refs/releaser-action/tags",
    ]);
    const tagsByCommit = new Map<string, string[]>();
    for (const line of output.split(/\r?\n/).filter(Boolean)) {
      const [tag, peeled, object] = line.split("\t");
      if (tag.startsWith(prefix) && pattern.test(tag.slice(prefix.length))) {
        const commit = peeled || object;
        tagsByCommit.set(commit, [...(tagsByCommit.get(commit) ?? []), tag]);
      }
    }
    const history = await this.exec([
      "log",
      "--first-parent",
      "--format=%H",
      "HEAD",
    ]);
    return history
      .split(/\r?\n/)
      .flatMap((commit) => tagsByCommit.get(commit) ?? []);
  }

  async add(files: string[]): Promise<void> {
    await this.exec(["add", "--", ...files]);
  }

  async commit(message: string): Promise<void> {
    if (await this.exec(["diff", "--cached", "--name-only"])) {
      await this.exec(["commit", "--message", message, "--"]);
    }
  }

  async createTag(tag: string, force = false): Promise<void> {
    await this.exec([
      "tag",
      "--annotate",
      ...(force ? ["--force"] : []),
      "--message",
      tag,
      "--",
      tag,
    ]);
  }

  private async readRemoteRefs(refs: Refs): Promise<Refs> {
    return parseRefs(
      await this.exec([
        "ls-remote",
        "--refs",
        "--",
        this.remote,
        ...refs.keys(),
      ]),
    );
  }

  private async pushRefs(expected: Refs, updates: Refs): Promise<void> {
    await this.exec([
      "push",
      "--atomic",
      "--porcelain",
      "--no-follow-tags",
      ...[...expected].map(
        ([ref, object]) => `--force-with-lease=${ref}:${object}`,
      ),
      "--",
      this.remote,
      ...[...updates].map(([ref, object]) => `${object}:${ref}`),
    ]);
  }

  async publish(
    branch: string,
    head: string,
    tag: string,
    aliases: string[],
    remoteTags: Refs,
  ): Promise<void> {
    const previous: Refs = new Map([[`refs/heads/${branch}`, head]]);
    const desired: Refs = new Map([
      [`refs/heads/${branch}`, await this.exec(["rev-parse", "HEAD"])],
    ]);
    for (const name of [tag, ...aliases]) {
      previous.set(`refs/tags/${name}`, remoteTags.get(name) ?? "");
      desired.set(`refs/tags/${name}`, await this.tagObject(name));
    }
    let pushError: unknown;
    try {
      await this.pushRefs(previous, desired);
    } catch (error) {
      pushError = error;
    }
    let actual: Refs;
    try {
      actual = await this.readRemoteRefs(previous);
    } catch {
      throw new PublicationUncertainError(
        "Cannot verify remote publication. Local release artifacts were retained; inspect the remote refs before retrying.",
      );
    }
    if (refsMatch(desired, actual)) return;

    const published = new Map(
      [...desired].filter(
        ([ref, object]) =>
          actual.get(ref) === object && object !== previous.get(ref),
      ),
    );
    if (published.size) {
      if (
        [...previous].some(
          ([ref, object]) =>
            (actual.get(ref) ?? "") !== object &&
            actual.get(ref) !== desired.get(ref),
        )
      ) {
        throw new PublicationUncertainError(
          "Partial publication and concurrent remote changes detected. Local release artifacts were retained; inspect refs before recovery.",
        );
      }
      const original = new Map(
        [...published.keys()].map((ref) => [ref, previous.get(ref) ?? ""]),
      );
      try {
        await this.pushRefs(published, original);
        if (!refsMatch(original, await this.readRemoteRefs(previous)))
          throw new Error("Remote recovery could not be verified");
      } catch {
        throw new PublicationUncertainError(
          "Partial publication could not be safely rolled back. Local release artifacts were retained; inspect refs before recovery.",
        );
      }
    }
    throw (
      pushError ??
      new Error(
        "Remote refs did not match the release; any observed partial publication was rolled back using leases",
      )
    );
  }

  async rollback(head: string, tags: Refs): Promise<void> {
    await this.exec(["reset", "--mixed", head, "--"]);
    for (const [tag, object] of tags) {
      await this.exec(
        object
          ? ["update-ref", `refs/tags/${tag}`, object]
          : ["update-ref", "-d", `refs/tags/${tag}`],
      );
    }
  }
}
