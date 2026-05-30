import { DiscordBot } from "../../bot/DiscordBot";
import type { DiscordContainerResolver, ServicesContainerResolver } from "../../types/core/containers";
import type { LoggerResolver } from "../../types/core/logs";
import type { DiscordBotResolver } from "../../types/discord/bot";

export class DiscordContainer implements DiscordContainerResolver {
    private _bot?: DiscordBotResolver;

    constructor(
        private readonly services: ServicesContainerResolver,
        private readonly logger: LoggerResolver,
    ) {}

    get bot(): DiscordBotResolver {
        return (this._bot ??= new DiscordBot(this.services, this.logger));
    }

    reset(): void {
        this._bot = undefined;
    }
}
