import { Client, GatewayIntentBits, Partials } from "discord.js";

import { CommandRouter } from "../commands/CommandRouter";
import { CommandRouterNotFoundError } from "../errors/internal/commands";
import type { ServicesContainerResolver } from "../types/core/containers";
import type { DependenciesResolver } from "../types/core/dependencies";
import type { LoggerResolver } from "../types/core/logs";
import type { DiscordBotResolver } from "../types/discord/bot";
import type { AnyDiscordEventHandler } from "../types/discord/eventHandler";
import { ReadyHandler } from "./events/ClientReady";
import { MessageCreateHandler } from "./events/MessageCreate";
import { MessageDeleteHandler } from "./events/MessageDelete";
import { MessageEditHandler } from "./events/MessageEdit";

const gatewayIntents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
];

export class DiscordBot implements DiscordBotResolver {
    client: Client;
    private _router?: CommandRouter;
    private readonly handlers: AnyDiscordEventHandler[];
    private readyResolver?: () => void;
    private readonly readyPromise: Promise<void>;

    constructor(
        private readonly services: ServicesContainerResolver,
        private readonly logger: LoggerResolver,
    ) {
        this.client = new Client({ intents: gatewayIntents, partials: [Partials.Message, Partials.Channel] });

        this.readyPromise = new Promise<void>((resolve) => {
            this.readyResolver = resolve;
        });

        this.handlers = [
            new ReadyHandler(this.services, this.logger, this),
            new MessageCreateHandler(this.services, this.logger, this),
            new MessageEditHandler(this.services, this.logger, this),
            new MessageDeleteHandler(this.services, this.logger, this),
        ];
    }

    async login(token: string): Promise<void> {
        await this.client.login(token);
        await this.readyPromise;
    }

    setupRouter(dependencies: DependenciesResolver): void {
        this._router = new CommandRouter(dependencies);
    }

    notifyReady(): void {
        this.readyResolver?.();
    }

    registerEventHandlers(): void {
        for (const handler of this.handlers) {
            handler.register(this.client, this.router);
        }
    }

    private get router(): CommandRouter {
        if (this._router === undefined) {
            throw new CommandRouterNotFoundError();
        }

        return this._router;
    }
}
