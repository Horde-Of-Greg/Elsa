import type { ConfigsResolver } from "../types/config/config";
import { Config } from "./Config";
import { type AppConfig, AppConfigSchema } from "./schemas/app.schema";
import { type EmojiConfig, EmojiConfigSchema } from "./schemas/emoji.schema";
import { type Env, EnvSchema } from "./schemas/env.schema";
import { type SeederConfig, SeederConfigSchema } from "./schemas/seeder.schema";

export class ConfigRegistry implements ConfigsResolver {
    private _env?: Env;
    private _app?: AppConfig;
    private _emoji?: EmojiConfig;
    private _seeder?: SeederConfig;

    get app(): AppConfig {
        return (this._app ??= new Config("app_config.json", AppConfigSchema).data);
    }

    get env(): Env {
        return (this._env ??= new Config(".env", EnvSchema).data);
    }

    get emoji(): EmojiConfig {
        return (this._emoji ??= new Config("emoji_config.json", EmojiConfigSchema).data);
    }

    get seeder(): SeederConfig {
        return (this._seeder ??= new Config("seeder_config.json", SeederConfigSchema).data);
    }

    reset(): void {
        this._app = undefined;
        this._env = undefined;
        this._emoji = undefined;
        this._seeder = undefined;
    }
}
