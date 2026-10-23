import fs from "node:fs";
import type { Git } from "./git.js";
import {
  ConventionalChangelog,
  type Preset as ChangelogPreset,
} from "conventional-changelog";
import {
  Bumper,
  type Preset as BumpPreset,
} from "conventional-recommended-bump";
import createPreset from "conventional-changelog-angular";
import type { ReleaseType } from "./next-version.js";

export interface ChangelogOptions {
  cwd: string;
  version: string;
  tag: string;
  from: string;
  to: string;
  repository: string;
  notesOnly?: boolean;
  date?: string;
}

const config = createPreset() as ChangelogPreset & BumpPreset;

export async function recommend(
  cwd: string,
  from: string,
): Promise<ReleaseType> {
  const result = await new Bumper(cwd)
    .config(config)
    .tag(from)
    .commits({ from, to: "HEAD" })
    .bump(config.whatBump);

  return "releaseType" in result ? result.releaseType : "patch";
}

export async function generateChangelogString(
  options: ChangelogOptions,
): Promise<string> {
  const previousTag = options.from.replace(
    /^refs\/releaser-action\/tags\//,
    "",
  );
  const generator = new ConventionalChangelog(options.cwd)
    .config(config)
    .options({ reset: true, releaseCount: 1 })
    .tags({ prefix: /$a/ })
    .commits({ from: options.from, to: options.to })
    .repository(options.repository)
    .context({
      version: options.version,
      currentTag: options.tag,
      previousTag: previousTag || undefined,
      date: options.date,
    })
    .writer({
      generateOn: () => false,
      finalizeContext: (context) => context,
      ...(options.notesOnly
        ? {
            headerPartial: () => "",
            preamblePartial: () => "",
          }
        : {}),
    });

  let result = "";

  for await (const chunk of generator.write()) {
    result += chunk;
  }

  return result.trim();
}

export async function generateChangelogFile(
  options: ChangelogOptions & {
    history: string[];
    tagPrefix: string;
    releaseCount: number;
  },
  file: string,
  git: Git,
): Promise<void> {
  const sections = [await generateChangelogString(options)];
  const { history, tagPrefix, releaseCount } = options;
  const count =
    releaseCount === 0
      ? history.length
      : Math.min(history.length, releaseCount - 1);

  for (let index = 0; index < count; index++) {
    const tag = history[index];
    const reference = `refs/releaser-action/tags/${tag}`;
    sections.push(
      await generateChangelogString({
        ...options,
        version: tag.slice(tagPrefix.length),
        tag,
        from: history[index + 1]
          ? `refs/releaser-action/tags/${history[index + 1]}`
          : "",
        to: reference,
        date: await git.exec(["log", "-1", "--format=%cs", reference, "--"]),
      }),
    );
  }

  fs.writeFileSync(file, sections.filter(Boolean).join("\n\n") + "\n");
}
