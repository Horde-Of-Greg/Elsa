import type { Client } from "discord.js";

import { core } from "../../core/Core";
import { DiscordEventHandler } from "../DiscordEventHandler";

export class ReadyHandler extends DiscordEventHandler<"clientReady"> {
    readonly eventName = "clientReady";
    readonly once = true;

    handle(client: Client): void {
        core.logger.info(`Ready as ${client.user?.tag}`);
        core.discord.bot.notifyReady();
    }
}
