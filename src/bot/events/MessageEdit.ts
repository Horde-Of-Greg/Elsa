import type { Message, PartialMessage } from "discord.js";
import type { CommandContext } from "../../commands/types";
import { DiscordEventHandler } from "../DiscordEventHandler";
import { app } from "../../core/App";

export class MessageEditHandler extends DiscordEventHandler<"messageUpdate"> {
    readonly eventName = "messageUpdate";
    readonly once = false;

    async handle(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void> {
        if (newMessage.partial || !newMessage.guild) return;
        app.core.logger.simpleLog("debug", "Received Edited Message");

        const context: CommandContext = {
            message: newMessage as Message,
            author: newMessage.author,
            guild: newMessage.guild,
            channel: newMessage.channel,
        };

        await this.router.route(context);
    }
}
