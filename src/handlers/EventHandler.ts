import type { Client, Message } from 'discord.js';
import { ParsedMessage, parseMessage } from '../utils/parser';
import { handleCommand } from '../commands';
import { assert } from 'console';

export class EventHandler {
    constructor(private readonly client: Client) {}

    async onReady() {
        console.log(`Bot ready as ${this.client.user?.tag}`);
    }

    async onMessageCreate(message: Message) {
        try {
            const parsedMessage: ParsedMessage = parseMessage(message.content);
            await handleCommand(message, parsedMessage);
        } catch (e) {
            // If the message couldn't be parsed, it's not a command - just ignore it
            if (e instanceof Error && e.message === 'Could not parse message') {
                return;
            }
            // For actual errors, reply and log
            message.reply('Internal error.');
            throw new Error(`Error during onMessageCreate process: ${e}`);
        }
    }
}
