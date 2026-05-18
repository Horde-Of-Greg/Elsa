import type { Client, ClientEvents } from "discord.js";

import type { CommandRouter } from "../../commands/CommandRouter";

export type AnyDiscordEventHandler = {
    [K in keyof ClientEvents]: DiscordEventHandlerResolver<K>;
}[keyof ClientEvents];

export interface DiscordEventHandlerResolver<K extends keyof ClientEvents> {
    handle(...args: ClientEvents[K]): Promise<void> | void;
    register(client: Client, router: CommandRouter): void;
}
