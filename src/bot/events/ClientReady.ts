import type { Client } from "discord.js";

import { core } from "../../core/Core.js";
import { dependencies } from "../../core/Dependencies.js";
import { DiscordEventHandler } from "../DiscordEventHandler.js";

export class ReadyHandler extends DiscordEventHandler<"clientReady"> {
    readonly eventName = "clientReady";
    readonly once = true;

    handle(client: Client): void {
        core.logger.info(`Ready as ${client.user?.tag}`);
        dependencies.discord.bot.notifyReady();
    }
}
