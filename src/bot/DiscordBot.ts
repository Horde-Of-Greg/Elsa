import { Client, type ClientEvents, GatewayIntentBits } from "discord.js";

import { CommandRouter } from "../commands/CommandRouter.js";
import type { DiscordEventHandler } from "./DiscordEventHandler.js";
import { ReadyHandler } from "./events/ClientReady.js";
import { MessageCreateHandler } from "./events/MessageCreate.js";
import { MessageEditHandler } from "./events/MessageEdit.js";

const gatewayIntents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
];

type AnyDiscordEventHandler = {
    [K in keyof ClientEvents]: DiscordEventHandler<K>;
}[keyof ClientEvents];

export class DiscordBot {
    name: string;
    client: Client;
    private readonly router: CommandRouter;
    private readonly handlers: AnyDiscordEventHandler[];
    private readyResolver?: () => void;
    private readonly readyPromise: Promise<void>;

    constructor() {
        this.client = new Client({ intents: gatewayIntents });
        this.router = new CommandRouter();

        this.readyPromise = new Promise<void>((resolve) => {
            this.readyResolver = resolve;
        });

        this.handlers = [new ReadyHandler(), new MessageCreateHandler(), new MessageEditHandler()];

        this.registerEventHandlers();
    }

    private registerEventHandlers(): void {
        for (const handler of this.handlers) {
            handler.register(this.client, this.router);
        }
    }

    async login(token: string): Promise<void> {
        await this.client.login(token);
        await this.readyPromise;
    }

    notifyReady(): void {
        this.readyResolver?.();
    }
}
