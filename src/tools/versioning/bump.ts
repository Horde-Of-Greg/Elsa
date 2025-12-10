import path from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { app } from '../../core/App';

if (!process.argv[2]) {
    returnUsageAndExit();
}

const ARGS = process.argv[2];
const VALUES = ['major', 'minor', 'patch'];
type VersionType = 'major' | 'minor' | 'patch';

if (!VALUES.includes(ARGS)) returnUsageAndExit();
const VERSION_TYPE = ARGS as VersionType;

main(VERSION_TYPE);

function main(version: VersionType) {
    editPackage(version);
}

function editPackage(versionType: VersionType) {
    const PACKAGE_PATH = path.join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(PACKAGE_PATH, 'utf-8'));

    const [major, minor, patch] = packageJson.version.split('.').map(Number);
    const oldVersion = packageJson.version;

    let newVersion: string;
    switch (versionType) {
        case 'major':
            newVersion = `${major + 1}.0.0`;
            break;
        case 'minor':
            newVersion = `${major}.${minor + 1}.0`;
            break;
        case 'patch':
            newVersion = `${major}.${minor}.${patch + 1}`;
            break;
        default:
            returnUsageAndExit();
            return;
    }

    packageJson.version = newVersion;
    writeFileSync(PACKAGE_PATH, JSON.stringify(packageJson, null, 4) + '\n');

    app.core.logger.simpleLog('success', `✓ Version bumped from ${oldVersion} to ${newVersion}`);
    process.exit(0);
}

function returnUsageAndExit() {
    app.core.logger.simpleLog('info', 'Usage: npm run bump -- <major|minor|patch>');
    process.exit(1);
}
