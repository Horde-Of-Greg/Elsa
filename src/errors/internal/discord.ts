import { InternalError } from "./InternalError";

export class ChannelNotFoundError extends InternalError {
    readonly code = "CHANNEL_NOT_FOUND";

    constructor(channelId: string) {
        super(`Could not find channel with id of: ${channelId}`);
    }
}
