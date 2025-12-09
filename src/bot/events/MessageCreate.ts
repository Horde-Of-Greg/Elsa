import { Client, Message } from 'discord.js';
import { CommandRouter } from '../../commands/CommandRouter';
import { CommandContext } from '../../commands/types';
import { DiscordEventHandler } from '../DiscordEventHandler';

export class MessageCreateHandler extends DiscordEventHandler<'messageCreate'> {
    readonly eventName = 'messageCreate';
    readonly once = false;

    async handle(message: Message): Promise<void> {
        if (!message.guild) return;

        const context: CommandContext = {
            message,
            author: message.author,
            guild: message.guild,
            channel: message.channel,
        };

        if (!CommandRouter.isCommand(message.content)) return;
        await this.router.route(context);
    }
}
