import { Logger } from "./logs/Logger";

class Core {
    private _logger?: Logger;

    get logger(): Logger {
        return (this._logger ??= new Logger());
    }
}

export const core = new Core();
