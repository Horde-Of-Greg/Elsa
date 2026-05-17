import type { Client } from "discord.js";

import type { DependenciesResolver } from "../core/dependencies";

export interface DiscordBotResolver {
    client: Client;
    login(token: string): Promise<void>;
    notifyReady(): void;

    setupRouter(dependencies: DependenciesResolver): void;
    registerEventHandlers(): void;
}
