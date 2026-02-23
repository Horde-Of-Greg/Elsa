import fs from "node:fs";
import path from "node:path";

export async function getSemVer(): Promise<string> {
    const packagePath = path.join(process.cwd(), "package.json");
    const _package = JSON.parse(await fs.promises.readFile(packagePath, "utf-8"));
    return _package.version;
}
