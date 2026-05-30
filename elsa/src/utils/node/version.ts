import fs from "node:fs";
import path from "node:path";

import { MalformedParsingResultError } from "../../errors/internal/general";

export async function getSemVer(): Promise<string> {
    const packagePath = path.join(process.cwd(), "package.json");
    const _package = JSON.parse(await fs.promises.readFile(packagePath, "utf-8")) as object;

    if (!("version" in _package)) {
        throw new MalformedParsingResultError({
            source: packagePath,
            objectTested: "version",
            failedCondition: "'version' property is missing",
        });
    }

    if (typeof _package.version !== "string") {
        throw new MalformedParsingResultError({
            source: packagePath,
            objectTested: "version",
            failedCondition: "'version' property should be a string, but it wasn't parsed a such",
        });
    }

    return _package.version;
}
