import { Logger } from '../logs/Logger';
import { TerminalStream } from '../logs/streams/TerminalStream';
import { Timer } from '../Timer';

export class CoreContainer {
    private _logger?: Logger;
    private _timers = new Map<string, Timer>();

    get logger(): Logger {
        return (this._logger ??= new Logger({
            name: 'global',
            stdout: new TerminalStream({ name: 'info', target: 'stdout' }),
            stderr: new TerminalStream({ name: 'error', target: 'stderr' }),
        }));
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
