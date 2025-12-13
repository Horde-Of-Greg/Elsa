import type { Client } from "discord.js";

import { app } from "../../core/App";
import { DiscordEventHandler } from "../DiscordEventHandler";

export class ReadyHandler extends DiscordEventHandler<"clientReady"> {
    readonly eventName = "clientReady";
    readonly once = true;

    handle(client: Client): void {
        app.core.logger.simpleLog("info", `Ready as ${client.user?.tag}`);
        app.discord.bot.notifyReady();
    }
}
