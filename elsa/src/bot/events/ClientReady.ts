import type { Client } from "discord.js";

import type { DiscordEventHandlerResolver } from "../../types/discord/eventHandler";
import { DiscordEventHandler } from "../DiscordEventHandler";

export class ReadyHandler
    extends DiscordEventHandler<"clientReady">
    implements DiscordEventHandlerResolver<"clientReady">
{
    readonly eventName = "clientReady";
    readonly once = true;

    handle(client: Client): void {
        this.logger.info(`Ready as ${client.user?.tag}`);
        this.discordBot.notifyReady();
    }
}
