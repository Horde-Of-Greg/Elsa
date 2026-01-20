import fs from "fs";
import path from "path";

import { core } from "../../src/core/Core";
import { isDevelopmentEnvironment } from "../../src/utils/node/environment";

if (isDevelopmentEnvironment()) process.exit(1);
const ARG: string | undefined = process.argv[2];
if (!ARG) {
    core.logger.error(
        "Tried to run search-error without args. Usage: npm run tools:search-error -- <ERROR_CODE>",
    );
}

const ROOT_DIR = process.cwd();
const SRC = path.join(ROOT_DIR, "src");
//prettier-ignore
const CLASS_MATCHER = new RegExp(`export class ([A-Z][A-Za-z]+) extends [A-Z][A-Za-z]+ {(?:\n\\s*(?:readonly )?httpStatus\\s?=\\s?\\d{3};?)?\n\\s*(?:readonly )?code\\s?=\\s?"([A-Z_]+)";?`)
const USAGE_MATCHER = (className: string) => new RegExp(`throw new ${className}`);

void main();

async function main() {
    const MATCHING_CLASSES = (await searchDir(SRC, CLASS_MATCHER)).filter(
        (result) => result.match[2] === ARG,
    );
    for (const matching_class of MATCHING_CLASSES) {
        const matches = await searchDir(SRC, USAGE_MATCHER(matching_class.match[1]));
        for (const match of matches) {
            core.logger.debug(`Found ${ARG} in ${match.fileName.replace(/(?:\/?\w+\/)*src\/(.+)/, "$1")}`);
        }
    }
}

async function searchDir(
    dir: string,
    toFind: RegExp,
): Promise<{ match: RegExpMatchArray; fileName: string }[]> {
    const matches: { match: RegExpMatchArray; fileName: string }[] = [];
    const children = await fs.promises.readdir(dir);
    for (const child of children) {
        const pathed_child = path.join(dir, child);
        const stats = await fs.promises.stat(pathed_child);
        if (stats.isDirectory()) {
            const result = await searchDir(pathed_child, toFind);
            if (result !== null) matches.push(...result);
            continue;
        }
        const file = await fs.promises.readFile(pathed_child, "utf-8");
        const match = file.match(toFind);
        if (match !== null) matches.push({ match: match, fileName: pathed_child });
    }
    return matches;
}
