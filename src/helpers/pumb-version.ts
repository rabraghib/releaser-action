import path from "node:path";
import { FsAdapters } from "./files-adapters.js";

export const bumpVersion = (
  files: string[],
  opts: { version: string },
): void => {
  for (const file of files) {
    const adapter = FsAdapters[path.extname(file).slice(1).toLowerCase()];
    if (!adapter)
      throw new Error(`Only JSON version files are supported: ${file}`);
    adapter.readVersion(file);
  }

  for (const file of files) {
    FsAdapters[path.extname(file).slice(1).toLowerCase()].updateVersion(
      file,
      opts.version,
    );
  }
};
