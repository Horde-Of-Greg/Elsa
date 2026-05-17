import type { Client, ClientEvents } from "discord.js";

import type { CommandRouter } from "../commands/CommandRouter";
import type { ServicesContainerResolver } from "../types/core/containers";
import type { LoggerResolver } from "../types/core/logs";
import type { DiscordBotResolver } from "../types/discord/bot";

export abstract class DiscordEventHandler<K extends keyof ClientEvents> implements DiscordEventHandler<K> {
    constructor(
        protected readonly services: ServicesContainerResolver,
        protected readonly logger: LoggerResolver,
        protected readonly discordBot: DiscordBotResolver,
    ) {}

    abstract readonly eventName: K;
    abstract readonly once: boolean;

    abstract handle(...args: ClientEvents[K]): Promise<void> | void;

    protected client!: Client;
    protected router!: CommandRouter;

    register(client: Client, router: CommandRouter): void {
        this.client = client;
        this.router = router;
        if (this.once) {
            this.client.once(this.eventName, (...args) => void this.handle(...args));
        } else {
            this.client.on(this.eventName, (...args) => void this.handle(...args));
        }
    }
}
