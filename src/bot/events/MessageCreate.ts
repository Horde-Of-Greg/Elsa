import type { Message } from "discord.js";
import type { CommandContext } from "../../commands/types";
import { DiscordEventHandler } from "../DiscordEventHandler";
import { app } from "../../core/App";

export class MessageCreateHandler extends DiscordEventHandler<"messageCreate"> {
    readonly eventName = "messageCreate";
    readonly once = false;

    async handle(message: Message): Promise<void> {
        if (!message.guild) return;
        if (message.author.bot) return;
        app.core.logger.simpleLog("debug", "Received New Message");

        const context: CommandContext = {
            message,
            author: message.author,
            guild: message.guild,
            channel: message.channel,
        };

        await this.router.route(context);
    }
}
