import type { Snowflake } from "discord.js";

import { InternalError } from "../InternalError";

export class ChannelNotFoundError extends InternalError {
    readonly code = "CHANNEL_NOT_FOUND";

    constructor(channelId: string) {
        super(`Could not find channel with id of: ${channelId}`);
    }
}

export class GuildNotFoundError extends InternalError {
    readonly code = "GUILD_NOT_FOUND";

    constructor(guildId: Snowflake) {
        super(`Could not find guild with id of: ${guildId}`);
    }
}

export class DcUserNotFoundError extends InternalError {
    readonly code = "USER_NOT_FOUND";

    constructor(userId: Snowflake) {
        super(`Could not find user with id of: ${userId}`);
    }
}
