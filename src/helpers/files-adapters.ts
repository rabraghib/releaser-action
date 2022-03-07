import fs from "fs";

interface Adapter {
  readVersion(file: string): string;
  updateVersion(file: string, version: string): void;
  read(file: string): string;
  write(file: string, data: any): void;
}

export const FsAdapters: { [key: string]: Adapter } = {
  json: new (class {
    readVersion(file: string) {
      return this.read(file).version;
    }
    updateVersion(file: string, version: string) {
      const data = this.read(file);
      data.version = version;
      this.write(file, data);
    }
    read(file: string) {
      return JSON.parse(fs.readFileSync(file, "utf8"));
    }
    write(file: string, data: any) {
      fs.writeFileSync(file, JSON.stringify(data, null, 2));
    }
  })(),
};
