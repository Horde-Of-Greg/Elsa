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
            assert(parsedMessage, 'Could not parse message');
            handleCommand(message, parsedMessage);
        } catch (e) {
            message.reply('Internal error.');
            throw new Error(`Error during onMessageCreate process: ${e}`);
        }
    }
}
