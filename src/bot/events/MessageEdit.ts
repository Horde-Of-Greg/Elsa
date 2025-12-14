import type { Message, PartialMessage } from "discord.js";

import type { CommandContext } from "../../commands/types";
import { app } from "../../core/App";
import { DiscordEventHandler } from "../DiscordEventHandler";

export class MessageEditHandler extends DiscordEventHandler<"messageUpdate"> {
    readonly eventName = "messageUpdate";
    readonly once = false;

    async handle(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void> {
        if (newMessage.partial || !newMessage.guild) return;
        app.core.logger.debug("Received Edited Message");

        const context: CommandContext = {
            message: newMessage as Message,
            author: newMessage.author,
            guild: newMessage.guild,
            channel: newMessage.channel,
        };

        await this.router.route(context);
    }
}
