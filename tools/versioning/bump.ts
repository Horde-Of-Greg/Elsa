import fs from "node:fs";
import path from "node:path";

import { PackageJson } from "zod-package-json";

import type { AcceptedBump } from "../types/versioning/title.js";
import type { ParsedSemVer } from "../types/versioning/version.js";
import { repoRoot } from "../utils/file/path.js";
import type { AcceptedProject } from "./../types/versioning/projects.js";

export function bumpProject(project: AcceptedProject, bump: AcceptedBump, dryRun = false): string | null {
    if (bump === "none") return null;

    const packagejson = getPackageJson(project);

    const semVer = parseSemVer(packagejson.version);
    semVer[bump] = semVer[bump] + 1;
    resetLowerComponents(semVer, bump);
    const newVersion = `${semVer.major}.${semVer.minor}.${semVer.patch}`;

    if (dryRun) return newVersion;

    packagejson.version = newVersion;
    writeToPackageJson(project, packagejson);

    return newVersion;
}

function getPackageJson(project: AcceptedProject): PackageJson {
    const pathToPackage = getPackageJsonPath(project);
    const packagejson: unknown = JSON.parse(fs.readFileSync(pathToPackage, "utf-8"));

    return PackageJson.parse(packagejson);
}

function parseSemVer(version: string): ParsedSemVer {
    const splitVersion = version.split(".");

    return {
        major: parseInt(splitVersion[0]),
        minor: parseInt(splitVersion[1]),
        patch: parseInt(splitVersion[2]),
    };
}

function getPackageJsonPath(project: AcceptedProject): string {
    return path.join(repoRoot, project, "package.json");
}

function writeToPackageJson(project: AcceptedProject, packagejson: PackageJson): void {
    const pathToPackage = getPackageJsonPath(project);
    fs.writeFileSync(pathToPackage, JSON.stringify(packagejson, undefined, 4));
}

function resetLowerComponents(version: ParsedSemVer, bumpType: AcceptedBump): void {
    if (bumpType === "major") {
        version.minor = 0;
        version.patch = 0;
    }

    if (bumpType === "minor") version.patch = 0;
}
