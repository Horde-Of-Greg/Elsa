import { Logger } from "./logs/Logger";
import { Timer } from "./Timer";

class Core {
    private _logger?: Logger;
    private readonly _timers = new Map<string, Timer>();

    get logger(): Logger {
        return (this._logger ??= new Logger());
    }

    startTimer(id: string): void {
        if (!this._timers.get(id)) {
            this._timers.set(id, new Timer());
        }
    }

    stopTimer(id: string): Timer {
        const timer = this._timers.get(id);
        if (!timer) throw new Error(`Timer ${id} not found`);
        this._timers.delete(id);
        return timer;
    }

    queryTimer(id: string): Timer {
        const timer = this._timers.get(id);
        if (!timer) throw new Error(`Timer ${id} not found`);
        return timer;
    }

    reset(): void {
        this._logger = undefined;
        this._timers.clear();
    }
}

export const core = new Core();
