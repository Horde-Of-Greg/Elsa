import type { Client, Message } from 'discord.js';
import { app } from '../core/App';
import { CommandRouter } from '../commands/CommandRouter';
import { CommandContext } from '../commands/Command';

export class BotEventHandler {
    router: CommandRouter;

    constructor(private readonly client: Client) {
        this.router = new CommandRouter();
    }

    async onReady() {
        app.core.logger.simpleLog('info', `Bot ready as ${this.client.user?.tag}`);
    }

    async onMessageCreate(message: Message) {
        app.core.logger.simpleLog('debug', 'Received message.');

        if (!message.guild) {
            return;
        }

        const context: CommandContext = {
            message: message,
            author: message.author,
            guild: message.guild,
            channel: message.channel,
        };

        if (!CommandRouter.isCommand(message.content)) {
            return;
        }
        await this.router.route(context);
    }
}
