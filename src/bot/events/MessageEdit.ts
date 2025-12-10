import type { Message, PartialMessage } from 'discord.js';
import { CommandRouter } from '../../commands/CommandRouter';
import type { CommandContext } from '../../commands/types';
import { DiscordEventHandler } from '../DiscordEventHandler';

export class MessageEditHandler extends DiscordEventHandler<'messageUpdate'> {
    readonly eventName = 'messageUpdate';
    readonly once = false;

    async handle(
        oldMessage: Message | PartialMessage,
        newMessage: Message | PartialMessage,
    ): Promise<void> {
        if (newMessage.partial || !newMessage.guild) return;

        const context: CommandContext = {
            message: newMessage as Message,
            author: newMessage.author,
            guild: newMessage.guild,
            channel: newMessage.channel,
        };

        if (!CommandRouter.isCommand(newMessage.content)) return;
        await this.router.route(context);
    }
}
