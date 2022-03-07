import * as core from "@actions/core";
import * as glob from "@actions/glob";
import { getNextVersion } from "./helpers/next-version";
import conventionalRecommendedBump from "conventional-recommended-bump";
import { FsAdapters } from "./helpers/files-adapters";
import { bumpVersion } from "./helpers/pumb-version";
import {
  generateChangelogFile,
  generateChangelogString,
} from "./helpers/generate-changelog";
import { Git } from "./helpers/git";

// @ts-ignore
import * as config from "conventional-changelog-angular";

const { GITHUB_REPOSITORY } = process.env;

try {
  run();
} catch (error: any) {
  core.setFailed(error);
}

async function getFiles(): Promise<string[]> {
  const files = core
    .getInput("bump-files")
    .split(",")
    .map((f) => f.trim())
    .map(async (f) => {
      const globber = await glob.create(f, {
        followSymbolicLinks: true,
      });
      return await globber.glob();
    });

  return Promise.all(files).then((b) => {
    return ([] as string[]).concat(...b);
  });
}

async function run() {
  const githubToken = core.getInput("token");
  const version = core.getInput("version");
  const skipEmptyRelease =
    core.getInput("skip-on-empty").toLowerCase() === "true";
  const versionFile = core.getInput("version-file").trim();
  const files = await getFiles();
  const outputFile = core.getInput("output-file");
  const tagPrefix = core.getInput("tag-prefix");
  const releaseCount = parseInt(core.getInput("release-count")) ?? 0;
  const birthday = core.getInput("birthday");

  core.setSecret(githubToken);

  // const gitUserName = core.getInput("git-user-name");
  // const gitUserEmail = core.getInput("git-user-email");
  const git = new Git("github-actions", "github-actions@github.com");
  git.updateOrigin(
    `https://x-access-token:${githubToken}@github.com/${GITHUB_REPOSITORY}.git`
  );
  // pull git history
  await git.pull();

  conventionalRecommendedBump(
    { config, tagPrefix },
    async (error, recommendation) => {
      if (error) {
        core.setFailed(error.message);
        return;
      }

      core.info(`Recommended release type: ${recommendation.releaseType}`);

      // If we have a reason also log it
      if (recommendation.reason) {
        core.info(`Because: ${recommendation.reason}`);
      }

      const newVersion = getNextVersion(
        {
          curr:
            FsAdapters[versionFile.split(".").pop() as string].readVersion(
              versionFile
            ) ?? "0.0.0",
          pattern: version,
          birthday,
        },
        recommendation.releaseType
      );
      const gitTag = `${tagPrefix}${newVersion}`;

      core.info(`Files to bump: ${files.join(", ")}`);

      bumpVersion(files, {
        version: newVersion,
      });

      // Generate the string changelog
      const stringChangelog = await generateChangelogString(
        tagPrefix,
        newVersion,
        1,
        config
      );
      core.info("Changelog generated");
      core.info(stringChangelog);

      // Removes the version number from the changelog
      const cleanChangelog = stringChangelog
        .split("\n")
        .slice(3)
        .join("\n")
        .trim();

      if (skipEmptyRelease && cleanChangelog === "") {
        core.info(
          "Generated changelog is empty and skip-on-empty has been activated so we skip this step"
        );
        core.setOutput("released", false);
        return;
      }

      core.info(`New version: ${newVersion}`);

      // If output file === 'false' we don't write it to file
      if (outputFile !== "false") {
        // Generate the changelog
        await generateChangelogFile(
          tagPrefix,
          newVersion,
          releaseCount,
          outputFile,
          config
        );
      }

      await git.add(".");
      await git.commit(`chore(release): ${newVersion} :tada: [skip ci]`);

      // Create the new tag
      await git.createTag(gitTag);

      try {
        core.info("Push all changes");
        await git.push();
      } catch (error: any) {
        console.error(error);

        core.setFailed(error);

        return;
      }

      // Set outputs so other actions (for example actions/create-release) can use it
      core.setOutput("tag", gitTag);
      core.setOutput("release_notes", cleanChangelog);
      core.setOutput("version", newVersion);
      core.setOutput("released", true);
    }
  );
}
