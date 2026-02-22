import type { Message } from "discord.js";

import { core } from "../../core/Core.js";
import type { CommandContext } from "../../types/command.js";
import { DiscordEventHandler } from "../DiscordEventHandler.js";

export class MessageCreateHandler extends DiscordEventHandler<"messageCreate"> {
    readonly eventName = "messageCreate";
    readonly once = false;

    async handle(message: Message): Promise<void> {
        if (!message.guild) return;
        if (message.author.bot) return;
        core.logger.debug("Received New Message");

        const context: CommandContext = {
            message,
            author: message.author,
            guild: message.guild,
            channel: message.channel,
        };

        await this.router.route(context);
    }
}
