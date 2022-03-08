import { DateTime } from "luxon";

interface IVersion {
  curr: string;
  pattern: string;
  birthday: string;
  extraTags: string[];
}

export const getNextVersion = (
  version: IVersion,
  type?: "major" | "minor" | "patch"
): [string, string[]] => {
  const variables: {
    [key: string]: number;
  } = prepareVars(version, type);
  variables["bump"] = getBump(version, variables);
  return [
    replaceVars(version.pattern, variables),
    version.extraTags.map((tag) => replaceVars(tag, variables)),
  ];
};

function replaceVars(version: string, vars: { [key: string]: number }) {
  return version.replace(/\{(.*?)\}/g, (match, p1) => {
    return `${vars[p1] ?? 0}`;
  });
}

function getBump(version: IVersion, vars: { [key: string]: number }) {
  const rest = version.pattern
    .split(".")
    .map((v) => {
      if (v.startsWith("{") && v.endsWith("}")) {
        return v.slice(1, -1);
      }
      return "";
    })
    .some((v) => {
      return vars[v] !== getVarValue(version, v);
    });
  return rest ? 0 : getVarValue(version, "bump") + 1;
}

function prepareVars(version: IVersion, type?: string) {
  const age = DateTime.now()
    .setZone("UTC")
    .diff(
      DateTime.fromISO(version.birthday, {
        zone: "UTC",
      }),
      ["years", "months", "days"]
    )
    .toObject();
  const vars = {
    major: getVarValue(version, "major"),
    minor: getVarValue(version, "minor"),
    patch: getVarValue(version, "patch"),
    years: Math.floor(age.years ?? 0),
    months: Math.floor(age.months ?? 0),
    days: Math.floor(age.days ?? 0),
  };
  switch (type) {
    case "major":
      vars.major += 1;
      vars.minor = 0;
      vars.patch = 0;
      break;

    case "minor":
      vars.minor += 1;
      vars.patch = 0;
      break;

    default:
      vars.patch += 1;
  }
  return vars;
}

function getVarValue(version: IVersion, name: string): number {
  const values = version.curr.split(".").map(Number);
  const vars = version.pattern.split(".").map((v) => {
    if (v.startsWith("{") && v.endsWith("}")) {
      return v.slice(1, -1);
    }
    return "-";
  });
  return values[vars.findIndex((v) => v === name)];
}
