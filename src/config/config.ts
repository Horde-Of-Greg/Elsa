import fs from "fs";
import path from "path";

import type { AppConfig, SeederConfig } from "./schema";
import { validateAppConfigs, validateSeederConfigs } from "./validate";

const configsPath: string = "config";

const appConfigPath: string = path.join(configsPath, "config.json");
const seedConfigPath: string = path.join(configsPath, "seeder_config.json");

const appConfigFile: object = JSON.parse(fs.readFileSync(appConfigPath, "utf-8"));
const seedConfigFile: object = JSON.parse(fs.readFileSync(seedConfigPath, "utf-8"));

export const appConfig: AppConfig = validateAppConfigs(appConfigFile);
export const seederConfig: SeederConfig = validateSeederConfigs(seedConfigFile);
