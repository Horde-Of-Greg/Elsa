import { TimerIdNotFound } from "../errors/internal/timer";
import type { TimerRegistryResolver } from "../types/time/timer";
import { Timer } from "./Timer";

export class TimerRegistry implements TimerRegistryResolver {
    private readonly _timers = new Map<string, Timer>();

    startTimer(id: string): void {
        if (!this._timers.get(id)) {
            this._timers.set(id, new Timer());
        }
    }

    stopTimer(id: string): Timer {
        const timer = this.getTimer(id);
        this._timers.delete(id);
        return timer;
    }

    queryTimer(id: string): Timer {
        return this.getTimer(id);
    }

    reset(): void {
        this._timers.clear();
    }

    private getTimer(id: string): Timer {
        const timer = this._timers.get(id);
        if (!timer) throw new TimerIdNotFound(id);
        return timer;
    }
}
