import { FsAdapters } from "./files-adapters";

export const bumpVersion = async (
  files: string[],
  opts: {
    version: string;
  }
) => {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const fileExtension = file.split(".").pop();
    FsAdapters[fileExtension as string].updateVersion(file, opts.version);
  }
};
