import fs from "node:fs";
import path from "node:path";

interface Manifest extends Record<string, unknown> {
  version: string;
}

interface Adapter {
  readVersion(file: string): string;
  updateVersion(file: string, version: string): void;
  read(file: string): Manifest;
  write(file: string, data: Manifest): void;
}

export interface FileSnapshot {
  file: string;
  before: Buffer | null;
}

export const FsAdapters: Record<string, Adapter> = {
  json: new (class implements Adapter {
    readVersion(file: string): string {
      return this.read(file).version;
    }

    updateVersion(file: string, version: string): void {
      const data = this.read(file);
      data.version = version;

      if (
        ["package-lock.json", "npm-shrinkwrap.json"].includes(
          path.basename(file),
        )
      ) {
        const packages = data.packages as Record<string, Manifest> | undefined;
        if (packages?.[""]) packages[""].version = version;
      }

      this.write(file, data);
    }

    read(file: string): Manifest {
      const data = JSON.parse(
        fs.readFileSync(file, "utf8").replace(/^\uFEFF/, ""),
      );

      if (
        !data ||
        Array.isArray(data) ||
        typeof data.version !== "string" ||
        !data.version
      ) {
        throw new Error(`Expected a top-level string version in ${file}`);
      }

      return data;
    }

    write(file: string, data: Manifest): void {
      const original = fs.readFileSync(file, "utf8");
      const indent = original.match(/\n([\t ]+)"/)?.[1] ?? 2;
      const newline = original.includes("\r\n") ? "\r\n" : "\n";
      const text = JSON.stringify(data, null, indent).replace(/\n/g, newline);
      fs.writeFileSync(
        file,
        (original.startsWith("\uFEFF") ? "\uFEFF" : "") +
          text +
          (original.endsWith("\n") ? newline : ""),
      );
    }
  })(),
};

export function safePath(
  root: string,
  input: string,
  allowNew = false,
): string {
  const file = path.resolve(root, input);
  const relative = path.relative(root, file);

  if (
    !relative ||
    relative === ".." ||
    relative.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relative)
  ) {
    throw new Error(`File must be inside the repository: ${file}`);
  }

  const parts = relative.split(path.sep);
  let current = root;

  for (let index = 0; index < parts.length; index++) {
    if (
      [".git", "node_modules", ".yarn", ".pnpm", "bower_components"].includes(
        parts[index].toLowerCase(),
      )
    ) {
      throw new Error(`Protected path: ${input}`);
    }

    current = path.join(current, parts[index]);
    const last = index === parts.length - 1;
    let stat: fs.Stats;
    try {
      stat = fs.lstatSync(current);
    } catch (error) {
      if (
        allowNew &&
        last &&
        (error as NodeJS.ErrnoException).code === "ENOENT"
      )
        continue;
      throw error;
    }

    if (stat.isSymbolicLink() || !(last ? stat.isFile() : stat.isDirectory())) {
      throw new Error(
        `Path must be a regular file with no symbolic links: ${input}`,
      );
    }
    if (last && stat.nlink > 1) {
      throw new Error(`Hard-linked files are unsupported: ${input}`);
    }
  }

  return file;
}

export function restoreFiles(files: FileSnapshot[]): void {
  for (const { file, before } of files) {
    if (before === null) fs.rmSync(file, { force: true });
    else fs.writeFileSync(file, before);
  }
}
