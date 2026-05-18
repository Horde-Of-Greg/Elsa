import type z from "zod";

import type { AppConfig } from "../../config/schemas/app.schema";
import type { EmojiConfig } from "../../config/schemas/emoji.schema";
import type { Env } from "../../config/schemas/env.schema";
import type { SeederConfig } from "../../config/schemas/seeder.schema";
import type { Resettable } from "../general";

export interface ConfigsResolver extends Resettable {
    app: AppConfig;
    env: Env;
    emoji: EmojiConfig;
    seeder: SeederConfig;
}

export type ConfigParams = {
    name: string;
    fileLocation: string;
    schema: z.ZodObject;
};

export type ConfigData = Record<string, unknown>;
