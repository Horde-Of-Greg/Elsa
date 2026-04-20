import fs from "node:fs";
import path from "node:path";

import { castNumberToTime, formatTime } from "../utils/time";
import type { AppConfig, EmojiConfig, SeederConfig } from "./schema";
import { validateAppConfigs, validateEmojiConfigs, validateSeederConfigs } from "./validate";

const configsPath = "config";

const appConfigPath: string = path.join(configsPath, "app_config.json");
const seedConfigPath: string = path.join(configsPath, "seeder_config.json");
const emojiConfigPath: string = path.join(configsPath, "emoji_config.json");

const appConfigFile = JSON.parse(fs.readFileSync(appConfigPath, "utf-8")) as object;
const seedConfigFile = JSON.parse(fs.readFileSync(seedConfigPath, "utf-8")) as object;
const emojiConfigFile = JSON.parse(fs.readFileSync(emojiConfigPath, "utf-8")) as object;

export const appConfig: AppConfig = validateAppConfigs(appConfigFile);
export const seederConfig: SeederConfig = validateSeederConfigs(seedConfigFile);
export const emojis: EmojiConfig = validateEmojiConfigs(emojiConfigFile);

const delayAdjusted = castNumberToTime(appConfig.COMMANDS.UNDELETE.DELAY_S, "s");
export const formattedDelay = formatTime(delayAdjusted);
