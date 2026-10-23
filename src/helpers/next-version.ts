import { DateTime } from "luxon";

export type ReleaseType = "major" | "minor" | "patch";
type Variables = Record<string, number>;

interface IVersion {
  curr: string;
  pattern: string;
  birthday: string;
  extraTags: string[];
}

const variableNames = [
  "major",
  "minor",
  "patch",
  "years",
  "months",
  "days",
  "bump",
];

export function versionPattern(
  pattern: string,
  alias = false,
): { regex: RegExp; variables: string[] } {
  const allowed = alias ? /^[\w.{}+\/-]+$/ : /^[\w.{}+-]+$/;
  if (!pattern || pattern.length > 200 || !allowed.test(pattern)) {
    throw new Error("Invalid version pattern (maximum 200 characters)");
  }
  if (!alias && /\}\{|\}[0-9]|[0-9]\{/.test(pattern)) {
    throw new Error(
      "Numeric placeholders must be separated by a nonnumeric literal",
    );
  }
  if (/[{}]/.test(pattern.replace(/\{([^{}]+)\}/g, ""))) {
    throw new Error("Malformed version placeholder");
  }

  const variables: string[] = [];
  const escape = (value: string) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  let source = "";
  let end = 0;
  for (const match of pattern.matchAll(/\{([^{}]+)\}/g)) {
    const name = match[1];
    if (!variableNames.includes(name) || variables.includes(name)) {
      throw new Error(`Unknown or repeated version placeholder: ${name}`);
    }
    source += escape(pattern.slice(end, match.index)) + "(0|[1-9][0-9]{0,15})";
    variables.push(name);
    end = match.index + match[0].length;
  }
  return {
    regex: new RegExp(`^${source}${escape(pattern.slice(end))}$`),
    variables,
  };
}

export const getNextVersion = (
  version: IVersion,
  type: ReleaseType = "patch",
  now = DateTime.utc(),
): [string, string[]] => {
  const pattern = versionPattern(version.pattern);
  const match = pattern.regex.exec(version.curr);
  if (
    !version.curr ||
    version.curr.length > 200 ||
    (pattern.variables.length && !match)
  ) {
    throw new Error(
      `Current version ${version.curr.slice(0, 200)} does not match pattern ${version.pattern}`,
    );
  }
  const previous = Object.fromEntries(
    pattern.variables.map((name, index) => [name, Number(match![index + 1])]),
  );
  const variables = prepareVars(version, previous, type, now);
  variables.bump = getBump(previous, variables, pattern.variables);
  if (
    Object.values(variables).some(
      (value) => !Number.isSafeInteger(value) || value < 0,
    )
  ) {
    throw new Error("Version components must be nonnegative safe integers");
  }
  return [
    replaceVars(version.pattern, variables),
    version.extraTags.map((tag) => replaceVars(tag, variables, true)),
  ];
};

function replaceVars(
  template: string,
  variables: Variables,
  alias = false,
): string {
  versionPattern(template, alias);
  const result = template.replace(/\{([^{}]+)\}/g, (_, name: string) =>
    String(variables[name]),
  );
  if (result.length > 200)
    throw new Error("Rendered version/tag exceeds 200 characters");
  return result;
}

function getBump(
  previous: Variables,
  variables: Variables,
  names: string[],
): number {
  const changed = names.some(
    (name) => name !== "bump" && variables[name] !== previous[name],
  );
  return changed ? 0 : (previous.bump ?? 0) + 1;
}

function prepareVars(
  version: IVersion,
  previous: Variables,
  type: ReleaseType,
  now: DateTime,
): Variables {
  const variables = Object.fromEntries(
    variableNames.map((name) => [name, previous[name] ?? 0]),
  );
  switch (type) {
    case "major":
      variables.major += 1;
      variables.minor = 0;
      variables.patch = 0;
      break;
    case "minor":
      variables.minor += 1;
      variables.patch = 0;
      break;
    default:
      variables.patch += 1;
  }

  if (!version.pattern.includes("{")) {
    const explicit =
      /^(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)(?:[-+].*)?$/.exec(
        version.pattern,
      );
    if (explicit) {
      [variables.major, variables.minor, variables.patch] = explicit
        .slice(1, 4)
        .map(Number);
    }
  }
  if (
    [version.pattern, ...version.extraTags].some((template) =>
      /\{(years|months|days)\}/.test(template),
    )
  ) {
    const birthday = DateTime.fromISO(version.birthday, { zone: "UTC" });
    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(version.birthday) ||
      !birthday.isValid ||
      birthday > now
    ) {
      throw new Error(
        "birthday must be a valid YYYY-MM-DD date in the past or today",
      );
    }
    const units = ["years", "months", "days"] as const;
    const age = now
      .startOf("day")
      .diff(birthday, [...units])
      .toObject();
    for (const unit of units) variables[unit] = Math.floor(age[unit] ?? 0);
  }
  return variables;
}
