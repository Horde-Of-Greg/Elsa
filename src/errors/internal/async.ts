import { InternalError } from "../InternalError";

export class WriteAfterCloseError extends InternalError {
    code = "WRITE_AFTER_CLOSE_ERROR";

    constructor(streamName: string) {
        super(`Tried to write into the stream ${streamName}, but this stream is not open.`);
    }
}
