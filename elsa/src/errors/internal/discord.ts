import { InternalError } from "../InternalError";

export class ChannelNotFoundError extends InternalError {
    readonly code = "CHANNEL_NOT_FOUND";

    constructor(channelId: string) {
        super(`Could not find channel with id of: ${channelId}`);
    }
}

export class DiscordBotNotFoundError extends InternalError {
    readonly code = "DISCORD_BOT_NOT_FOUND";

    constructor() {
        super("Tried to execute logic on the discord bot, but could not access it.");
    }
}
