import { type Message, type PartialMessage, Routes } from "discord.js";

import { Cache } from "../../caching/Cache";
import { DiscordBotNotFoundError } from "../../errors/internal/discord";
import type { ConfigsResolver } from "../../types/config/config";
import type { CacheContainerResolver } from "../../types/core/containers";
import type { DiscordBotResolver } from "../../types/discord/bot";
import type { MessageFindParameters } from "../../types/discord/messages";
import type { MessageLinkServiceResolver } from "../../types/services/messageLink";
import { RedisKeys } from "../../utils/keys/RedisKeys";
import { ensureStrictPositive } from "../../utils/numbers/positive";

export class MessageLinkService implements MessageLinkServiceResolver {
    cache: Cache<MessageFindParameters>;
    private _bot?: DiscordBotResolver;
    private readonly redisKeys: RedisKeys;

    constructor(
        readonly cacheProvider: CacheContainerResolver,
        configs: ConfigsResolver,
    ) {
        this.cache = new Cache<MessageFindParameters>(
            "message_links",
            ensureStrictPositive(86400),
            false,
            cacheProvider,
            configs,
        );
        this.redisKeys = new RedisKeys(configs);
    }

    async linkNewMessage(userMessage: Message, botMessage: Message): Promise<void> {
        await this.cache.set(this.redisKeys.makeMessageLinkKey(userMessage), {
            messageId: botMessage.id,
            channelId: botMessage.channelId,
        });
    }

    async deleteLinkedMessage(userMessage: Message | PartialMessage): Promise<void> {
        const cacheResult = await this.cache.get(this.redisKeys.makeMessageLinkKey(userMessage));
        if (!cacheResult) return;

        await this.bot.client.rest.delete(
            Routes.channelMessage(cacheResult.channelId, cacheResult.messageId),
        );

        await this.cache.delete(this.redisKeys.makeMessageLinkKey(userMessage));
    }

    setBot(bot: DiscordBotResolver): void {
        this._bot = bot;
    }

    private get bot(): DiscordBotResolver {
        if (this._bot === undefined) {
            throw new DiscordBotNotFoundError();
        }

        return this._bot;
    }
}
