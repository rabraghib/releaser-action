import conventionalChangelog from "conventional-changelog";
import fs from "fs";

const generateChangelogStream = (
  tagPrefix: string,
  version: string,
  releaseCount: number
) =>
  conventionalChangelog(
    {
      preset: "angular",
      releaseCount,
      tagPrefix,
    },
    {
      version,
      title: `${tagPrefix}${version}`,
    }
  );

export const generateChangelogFile = (
  tagPrefix: string,
  version: string,
  releaseCount: number,
  path: string
) =>
  new Promise((resolve) => {
    const changelogStream = generateChangelogStream(
      tagPrefix,
      version,
      releaseCount
    );

    changelogStream.pipe(fs.createWriteStream(path)).on("finish", resolve);
  });

export const generateChangelogString = (
  tagPrefix: string,
  version: string,
  releaseCount: number
) =>
  new Promise<string>((resolve, reject) => {
    const changelogStream = generateChangelogStream(
      tagPrefix,
      version,
      releaseCount
    );
    let changelog = "";

    changelogStream
      .on("data", (data) => {
        changelog += data.toString();
      })
      .on("end", () => resolve(changelog));
  });
