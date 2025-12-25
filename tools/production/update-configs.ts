/* eslint-disable no-console */

import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const ROOT_DIR = process.cwd();
dotenv.config();

function recursiveScan(dir: string) {
    for (const dir_child of fs.readdirSync(dir)) {
        const child_path = path.join(dir, dir_child);
        const child_stats = fs.statSync(child_path);
        if (child_stats.isDirectory()) {
            switch (child_path) {
                case "src":
                case "docs":
                case "logs":
                case "tools":
                case ".github":
                case "node_modules":
                case ".git":
                    continue;

                default:
                    recursiveScan(child_path);
                    break;
            }
        }
        const match = dir_child.match(/^(?:\w+)?.(\w+).template$/);
        if (!match) continue;
        const fileExtension = match[1];
        switch (fileExtension) {
            case "env":
                scanEnv(child_path);
                break;

            case "json":
                scanJson(child_path);
                break;

            default:
                console.error(
                    `Error: unhandled file extension in update-config.ts, contact the maintainers if you did not add any files ending in .template.`,
                );
                process.exit(1);
        }
    }
}

function scanEnv(templateFileName: string) {
    const productionEnv = process.env;
    const templateLines = fs.readFileSync(templateFileName, "utf-8").split("\n");
    for (const line of templateLines) {
        const match = line.match(/^([A-Z_]+)=.+$/);
        if (!match) continue;
        const lineKey = match[1];
        if (productionEnv[lineKey] === undefined) {
            console.warn(`Please set the value of ${lineKey} in .env`);
        }
    }
}

function scanJson(templateFileName: string) {
    const productionFileName = templateFileName.replace(".template", "");
    if (!fs.existsSync(productionFileName)) {
        fs.writeFileSync(productionFileName, "{}");
    }
    const production = JSON.parse(fs.readFileSync(productionFileName, "utf-8"));
    const template = JSON.parse(fs.readFileSync(templateFileName, "utf-8"));

    const modified = scanJsonRecursive(production, template);

    if (modified) {
        fs.writeFileSync(productionFileName, JSON.stringify(production, null, 4) + "\n");
        console.info(`Updated ${productionFileName} with missing keys from template`);
    }
}

function scanJsonRecursive(production: Record<string, unknown>, template: object): boolean {
    let modified = false;

    for (const [key, templateValue] of Object.entries(template)) {
        if (!(key in production)) {
            production[key] = structuredClone(templateValue);
            modified = true;
        } else if (
            templateValue !== null &&
            typeof templateValue === "object" &&
            !Array.isArray(templateValue)
        ) {
            const productionValue = production[key];
            if (
                typeof productionValue === "object" &&
                productionValue !== null &&
                !Array.isArray(productionValue)
            ) {
                if (scanJsonRecursive(productionValue as Record<string, unknown>, templateValue)) {
                    modified = true;
                }
            }
        }
    }

    return modified;
}

recursiveScan(ROOT_DIR);
