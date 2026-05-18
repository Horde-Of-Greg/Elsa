import type { Message, PartialMessage } from "discord.js";

import type { Cache } from "../../caching/Cache";
import type { DiscordBotResolver } from "../discord/bot";
import type { MessageFindParameters } from "../discord/messages";

export interface MessageLinkServiceResolver {
    cache: Cache<MessageFindParameters>;

    linkNewMessage(userMessage: Message, botMessage: Message): Promise<void>;
    deleteLinkedMessage(userMessage: Message | PartialMessage): Promise<void>;

    setBot(bot: DiscordBotResolver): void;
}
