import type { Message, OmitPartialGroupDMChannel, PartialMessage } from "discord.js";

import type { DiscordEventHandlerResolver } from "../../types/discord/eventHandler";
import { DiscordEventHandler } from "../DiscordEventHandler";

export class MessageDeleteHandler
    extends DiscordEventHandler<"messageDelete">
    implements DiscordEventHandlerResolver<"messageDelete">
{
    readonly eventName = "messageDelete";
    readonly once = false;

    async handle(message: OmitPartialGroupDMChannel<Message | PartialMessage>): Promise<void> {
        if (message.author !== null && message.author.bot) return;
        this.logger.debug("Received Deleted Message");

        await this.services.messageLinkService.deleteLinkedMessage(message);
    }
}
