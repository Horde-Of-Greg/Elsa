import type { Message, OmitPartialGroupDMChannel, PartialMessage } from "discord.js";

import { core } from "../../core/Core";
import { DiscordEventHandler } from "../DiscordEventHandler";

export class MessageDeleteHandler extends DiscordEventHandler<"messageDelete"> {
    readonly eventName = "messageDelete";
    readonly once = false;

    async handle(message: OmitPartialGroupDMChannel<Message | PartialMessage>): Promise<void> {
        if (!message.author) return;
        if (message.author.bot) return;
        core.logger.debug("Received Deleted Message");

        await this.services.messageLinkService.deleteLinkedMessage(message);
    }
}
