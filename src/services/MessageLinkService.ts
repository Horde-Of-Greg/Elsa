import { type Message, type PartialMessage, Routes } from "discord.js";

import { Cache } from "../caching/Cache";
import { redisKeys } from "../caching/keys";
import { dependencies } from "../core/Dependencies";
import type { MessageFindParameters } from "../types/discord/messages";
import { ensureStrictPositive } from "../utils/numbers/positive";

export class MessageLinkService {
    cache!: Cache<MessageFindParameters>;

    constructor(
        private readonly cacheProvider = dependencies.cache,
        private readonly bot = dependencies.discord.bot,
    ) {
        this.cache = new Cache<MessageFindParameters>(
            "message_links",
            ensureStrictPositive(86400),
            false,
            cacheProvider,
        );
    }

    async linkNewMessage(userMessage: Message, botMessage: Message): Promise<void> {
        await this.cache.set(redisKeys.messageLink(userMessage), {
            messageId: botMessage.id,
            channelId: botMessage.channelId,
        });
    }

    async deleteLinkedMessage(userMessage: Message | PartialMessage): Promise<void> {
        const cacheResult = await this.cache.get(redisKeys.messageLink(userMessage));
        if (!cacheResult) return;

        await this.bot.client.rest.delete(
            Routes.channelMessage(cacheResult.channelId, cacheResult.messageId),
        );

        await this.cache.delete(redisKeys.messageLink(userMessage));
    }
}
