import type { Client, Message } from 'discord.js';
import { parseCommand, ParsedMessage, parseMessage } from '../utils/parser';
import { config } from '../config/config';
import { handleTag } from '../commands/tag';
import { handleAddTag } from '../commands/addtag';
import { handleSetRank } from '../commands/setrank';

export class EventHandler {
    constructor(private readonly client: Client) {}

    async onReady() {
        console.log(`Bot ready as ${this.client.user?.tag}`);
    }

    async onMessageCreate(message: Message) {
        // TODO: Refactor this to be WAY shorter
        if (message.author.bot) return;
        const parsed = parseMessage(message.content);
        if (!parsed) return;

        try {
            switch (command) {
                case 'tag':
                    await handleTag(message, parsedMessage);
                    break;
                case 'addtag':
                    await handleAddTag(message, parsedMessage);
                    break;
                case 'setrank':
                    await handleSetRank(message, args);
                    break;
                case 'cm': // command menu
                    await message.reply(
                        '**!px Command Menu**\n' +
                            '`!px tag <tag> <subtag>`  –  show saved message (rank 0+)\n' +
                            '`!px addtag "tag" "subtag" "https://...msg-link"`  –  save message (rank 3+)\n' +
                            '`!px setrank @User 0-5`  –  change user rank (rank 4+)\n' +
                            '`!px CM`  –  show this menu',
                    );
                    break;
            }
        } catch (e) {
            message.reply('Internal error.');
            throw new Error(`Error during onMessageCreate process: ${e}`);
        }
    }
}
