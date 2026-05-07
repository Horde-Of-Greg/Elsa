import { InternalError } from "../InternalError";

export class TimerIdNotFound extends InternalError {
    readonly code = "TIMER_ID_NOT_FOUND";

    constructor(id: string) {
        super(`Could not find a timer with the id: ${id}`);
    }
}
