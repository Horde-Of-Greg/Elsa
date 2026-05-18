import type { Message, PartialMessage } from "discord.js";

import type { CommandContext } from "../../types/commands/command";
import type { DiscordEventHandlerResolver } from "../../types/discord/eventHandler";
import { DiscordEventHandler } from "../DiscordEventHandler";

export class MessageEditHandler
    extends DiscordEventHandler<"messageUpdate">
    implements DiscordEventHandlerResolver<"messageUpdate">
{
    readonly eventName = "messageUpdate";
    readonly once = false;

    async handle(oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage): Promise<void> {
        if (newMessage.partial || !newMessage.guild) return;
        this.logger.debug("Received Edited Message");

        await this.services.messageLinkService.deleteLinkedMessage(oldMessage);

        const context: CommandContext = {
            message: newMessage,
            author: newMessage.author,
            guild: newMessage.guild,
            channel: newMessage.channel,
        };

        await this.router.route(context);
    }
}
