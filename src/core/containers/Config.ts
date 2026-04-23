import { Config } from "../../config/Config";
import { type AppConfig, AppConfigSchema } from "../../config/schemas/app.schema";
import { type EmojiConfig, EmojiConfigSchema } from "../../config/schemas/emoji.schema";
import { type Env, EnvSchema } from "../../config/schemas/env.schema";
import { type SeederConfig, SeederConfigSchema } from "../../config/schemas/seeder.schema";

export interface ConfigResolver {
    app: AppConfig;
    env: Env;
    emoji: EmojiConfig;
    seeder: SeederConfig;
    reset(): void;
}

export class ConfigContainer implements ConfigResolver {
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
        return (this._emoji ??= new Config(".emoji_config.json", EmojiConfigSchema).data);
    }

    get seeder(): SeederConfig {
        return (this._seeder ??= new Config(".seeder_config.json", SeederConfigSchema).data);
    }

    reset(): void {
        this._app = undefined;
        this._env = undefined;
        this._emoji = undefined;
        this._seeder = undefined;
    }
}
