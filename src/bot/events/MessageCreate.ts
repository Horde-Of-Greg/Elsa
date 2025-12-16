import type { Message } from "discord.js";

import type { CommandContext } from "../../commands/types";
import { core } from "../../core/Core";
import { DiscordEventHandler } from "../DiscordEventHandler";

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
