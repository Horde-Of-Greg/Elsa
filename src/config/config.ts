import fs from "node:fs";
import path from "node:path";

import type { AppConfig, EmojiConfig, SeederConfig } from "./schema";
import { validateAppConfigs, validateEmojiConfigs, validateSeederConfigs } from "./validate";

const configsPath: string = "config";

const appConfigPath: string = path.join(configsPath, "app_config.json");
const seedConfigPath: string = path.join(configsPath, "seeder_config.json");
const emojiConfigPath: string = path.join(configsPath, "emoji_config.json");

const appConfigFile: object = JSON.parse(fs.readFileSync(appConfigPath, "utf-8"));
const seedConfigFile: object = JSON.parse(fs.readFileSync(seedConfigPath, "utf-8"));
const emojiConfigFile: object = JSON.parse(fs.readFileSync(emojiConfigPath, "utf-8"));

export const appConfig: AppConfig = validateAppConfigs(appConfigFile);
export const seederConfig: SeederConfig = validateSeederConfigs(seedConfigFile);
export const emojis: EmojiConfig = validateEmojiConfigs(emojiConfigFile);
