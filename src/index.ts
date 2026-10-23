import fs from "node:fs";
import path from "node:path";
import * as core from "@actions/core";
import * as glob from "@actions/glob";
import { getNextVersion, versionPattern } from "./helpers/next-version.js";
import {
  FsAdapters,
  safePath,
  restoreFiles,
} from "./helpers/files-adapters.js";
import {
  generateChangelogFile,
  generateChangelogString,
  recommend,
} from "./helpers/generate-changelog.js";
import { bumpVersion } from "./helpers/pumb-version.js";
import { Git, PublicationUncertainError } from "./helpers/git.js";

async function getFiles(git: Git, versionFile: string): Promise<string[]> {
  const patterns = core.getMultilineInput("bump-files");
  const globber = await glob.create(
    [
      ...(patterns.length ? patterns : ["package.json"]),
      "!**/node_modules/**",
      "!**/.git/**",
      "!**/.yarn/**",
      "!**/.pnpm/**",
      "!**/bower_components/**",
    ].join("\n"),
    {
      followSymbolicLinks: false,
      matchDirectories: false,
      implicitDescendants: false,
    },
  );
  const files = [
    ...new Set((await globber.glob()).map((file) => safePath(git.cwd, file))),
  ];

  if (!files.includes(versionFile)) {
    throw new Error(
      "bump-files must include version-file so future releases read the published version",
    );
  }
  for (const file of files) {
    await git.exec([
      "ls-files",
      "--error-unmatch",
      "--",
      path.relative(git.cwd, file),
    ]);
  }
  return files;
}

async function run(): Promise<void> {
  core.setOutput("released", "false");
  const githubToken = core.getInput("token");
  const version = core.getInput("version") || "{major}.{minor}.{patch}";
  const extraTags = core.getMultilineInput("extra-tags");
  const skipEmptyRelease = (
    core.getInput("skip-on-empty") || "true"
  ).toLowerCase();
  const outputFile = core.getInput("output-file") || "CHANGELOG.md";
  const tagPrefix = core.getInput("tag-prefix");
  const count = core.getInput("release-count") || "0";
  const releaseCount = Number(count);
  const birthday = core.getInput("birthday");
  const server = process.env.GITHUB_SERVER_URL || "https://github.com";
  const repository = process.env.GITHUB_REPOSITORY || "";
  const ref = process.env.GITHUB_REF || "";
  const event = process.env.GITHUB_EVENT_NAME || "";

  if (
    !ref.startsWith("refs/heads/") ||
    !["push", "workflow_dispatch", "schedule"].includes(event)
  ) {
    throw new Error(
      "Releases require a branch ref on push, workflow_dispatch, or schedule; PR and tag events are unsupported",
    );
  }
  if (!["true", "false"].includes(skipEmptyRelease)) {
    throw new Error("skip-on-empty must be true or false");
  }
  if (!/^(0|[1-9][0-9]*)$/.test(count) || !Number.isSafeInteger(releaseCount)) {
    throw new Error("release-count must be a nonnegative safe integer");
  }

  if (githubToken) core.setSecret(githubToken);
  const workspace = fs.realpathSync.native(
    process.env.GITHUB_WORKSPACE || process.cwd(),
  );
  process.chdir(workspace);
  const branch = ref.slice("refs/heads/".length);
  const git = new Git(workspace);
  await git.authenticate(githubToken, server, repository);
  const head = await git.prepare(branch);
  const versionFile = safePath(
    workspace,
    core.getInput("version-file") || "package.json",
  );
  const adapter = FsAdapters[path.extname(versionFile).slice(1).toLowerCase()];
  if (!adapter)
    throw new Error(`Only JSON version files are supported: ${versionFile}`);
  const currentVersion = adapter.readVersion(versionFile);
  const parsed = versionPattern(version);
  const historyPattern = parsed.variables.length
    ? parsed.regex
    : versionPattern("{major}.{minor}.{patch}").regex;
  const remoteTags = await git.remoteTags();
  const history = (await git.releaseTags(tagPrefix, historyPattern)).filter(
    (tag) => remoteTags.has(tag),
  );
  const currentTag = `${tagPrefix}${currentVersion}`;

  if (history.length && history[0] !== currentTag) {
    throw new Error(
      `Version file (${currentVersion}) does not match latest release tag (${history[0]})`,
    );
  }
  const previousTag =
    history[0] ?? (remoteTags.has(currentTag) ? currentTag : "");
  const previous = previousTag
    ? `refs/releaser-action/tags/${previousTag}`
    : "";
  if (previous)
    await git.exec(["merge-base", "--is-ancestor", previous, "HEAD"]);

  const recommendation = await recommend(workspace, previous);
  core.info(`Recommended release type: ${recommendation}`);
  const [newVersion, aliases] = getNextVersion(
    {
      curr: currentVersion,
      pattern: version,
      birthday,
      extraTags,
    },
    recommendation,
  );
  const gitTag = `${tagPrefix}${newVersion}`;
  const gitTags = [...new Set(aliases)];
  for (const tag of [gitTag, ...gitTags]) await git.validateTag(tag);
  if (
    gitTags.includes(gitTag) ||
    gitTags.some(
      (tag) =>
        tag.startsWith(tagPrefix) &&
        historyPattern.test(tag.slice(tagPrefix.length)),
    )
  ) {
    throw new Error(
      "extra-tags must be aliases distinct from full release versions",
    );
  }

  const context = {
    cwd: workspace,
    version: newVersion,
    tag: gitTag,
    from: previous,
    to: "HEAD",
    repository: repository ? `${server}/${repository}` : "",
  };
  const cleanChangelog = await generateChangelogString({
    ...context,
    notesOnly: true,
  });
  if (skipEmptyRelease === "true" && !cleanChangelog) {
    core.info("No release notes; skipped without modifying files or refs");
    return;
  }
  if (remoteTags.has(gitTag) || (await git.tagObject(gitTag))) {
    throw new Error(`Release tag already exists: ${gitTag}`);
  }

  const files = await getFiles(git, versionFile);
  let changelogFile: string | undefined;
  if (outputFile !== "false") {
    changelogFile = safePath(workspace, outputFile, true);
    if (files.includes(changelogFile))
      throw new Error("output-file cannot also be a version file");
    if (
      await git.exec(
        ["check-ignore", "--", path.relative(workspace, changelogFile)],
        true,
      )
    ) {
      throw new Error("output-file must not be ignored by Git");
    }
  }
  const releaseFiles = changelogFile ? [...files, changelogFile] : files;
  const snapshots = releaseFiles.map((file) => ({
    file,
    before: fs.existsSync(file) ? fs.readFileSync(file) : null,
  }));
  const oldTags = new Map<string, string>();
  for (const tag of [gitTag, ...gitTags])
    oldTags.set(tag, await git.tagObject(tag));
  await git.assertClean();

  try {
    bumpVersion(files, { version: newVersion });
    if (changelogFile) {
      await generateChangelogFile(
        { ...context, history, tagPrefix, releaseCount },
        changelogFile,
        git,
      );
    }
    await git.add(releaseFiles.map((file) => path.relative(workspace, file)));
    await git.commit(`chore(release): ${newVersion} :tada: [skip ci]`);
    await git.createTag(gitTag);
    for (const tag of gitTags) await git.createTag(tag, true);
    await git.publish(branch, head, gitTag, gitTags, remoteTags);
  } catch (error) {
    if (error instanceof PublicationUncertainError) throw error;
    try {
      await git.rollback(head, oldTags);
      restoreFiles(snapshots);
    } catch (rollbackError) {
      throw new AggregateError(
        [error, rollbackError],
        "Release failed and local rollback was incomplete",
      );
    }
    throw error;
  }

  core.setOutput("tag", gitTag);
  core.setOutput("release_notes", cleanChangelog);
  core.setOutput("version", newVersion);
  core.setOutput("released", "true");
}

run().catch((error: unknown) => {
  core.setFailed(error instanceof Error ? error.message : String(error));
});
