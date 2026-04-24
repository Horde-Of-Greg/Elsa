import fs from "node:fs";
import path from "node:path";

export async function getSemVer(): Promise<string> {
    const packagePath = path.join(process.cwd(), "package.json");
    const _package = JSON.parse(await fs.promises.readFile(packagePath, "utf-8")) as object;

    if (!("version" in _package)) {
        throw new Error("Failure while parsing package.json; 'version' property missing.");
    }

    if (typeof _package.version !== "string") {
        throw new Error("Failure while parsing package.json; 'version' was not parsed as a string");
    }

    return _package.version;
}
