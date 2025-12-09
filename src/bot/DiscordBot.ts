import { Client, ClientEvents, GatewayIntentBits, Message } from 'discord.js';
import { config } from '../config/config';
import { CommandRouter } from '../commands/CommandRouter';
import { CommandContext } from '../commands/types';
import { app } from '../core/App';
import { DiscordEventHandler } from './DiscordEventHandler';
import { ReadyHandler } from './events/ClientReady';
import { MessageCreateHandler } from './events/MessageCreate';
import { MessageEditHandler } from './events/MessageEdit';

const gatewayIntents = [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
];

export class DiscordBot {
    name: string;
    client: Client;
    private router: CommandRouter;
    private handlers: Array<DiscordEventHandler<any>>;

    constructor() {
        this.client = new Client({ intents: gatewayIntents });
        this.router = new CommandRouter();

        this.handlers = [new ReadyHandler(), new MessageCreateHandler(), new MessageEditHandler()];

        this.registerEventHandlers();
    }

    private registerEventHandlers(): void {
        for (const handler of this.handlers) {
            handler.setDependencies(this.client, this.router);
            if (handler.once) {
                this.client.once(handler.eventName, (...args) => handler.handle(...args));
            } else {
                this.client.on(handler.eventName, (...args) => handler.handle(...args));
            }
        }
    }

    async login(token: string): Promise<void> {
        await this.client.login(token);
    }
}
