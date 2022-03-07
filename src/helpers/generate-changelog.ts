import conventionalChangelog from "conventional-changelog";
import fs from "fs";

const generateChangelogStream = (
  tagPrefix: string,
  version: string,
  releaseCount: number,
  config: any
) =>
  conventionalChangelog(
    {
      config,
      releaseCount,
      tagPrefix,
    },
    {
      version,
    }
  );

export const generateChangelogFile = (
  tagPrefix: string,
  version: string,
  releaseCount: number,
  path: string,
  config: any
) =>
  new Promise((resolve) => {
    const changelogStream = generateChangelogStream(
      tagPrefix,
      version,
      releaseCount,
      config
    );

    changelogStream.pipe(fs.createWriteStream(path)).on("finish", resolve);
  });

export const generateChangelogString = (
  tagPrefix: string,
  version: string,
  releaseCount: number,
  config: any
) =>
  new Promise<string>((resolve, reject) => {
    const changelogStream = generateChangelogStream(
      tagPrefix,
      version,
      releaseCount,
      config
    );
    let changelog = "";

    changelogStream
      .on("data", (data) => {
        changelog += data.toString();
      })
      .on("end", () => resolve(changelog));
  });
