import type { Message, PartialMessage } from "discord.js";

import { core } from "../../core/Core";
import type { CommandContext } from "../../types/command";
import { DiscordEventHandler } from "../DiscordEventHandler";

export class MessageEditHandler extends DiscordEventHandler<"messageUpdate"> {
    readonly eventName = "messageUpdate";
    readonly once = false;

    async handle(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void> {
        if (newMessage.partial || !newMessage.guild) return;
        core.logger.debug("Received Edited Message");

        await this.services.messageLinkService.deleteLinkedMessage(newMessage);

        const context: CommandContext = {
            message: newMessage,
            author: newMessage.author,
            guild: newMessage.guild,
            channel: newMessage.channel,
        };

        await this.router.route(context);
    }
}
