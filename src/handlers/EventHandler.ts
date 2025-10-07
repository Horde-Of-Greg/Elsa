import type { Client, Message } from 'discord.js';
import { parseCommand } from '../utils/parser';
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
        const parsed = parseCommand(message.content, config.PREFIX);
        if (!parsed) return;
        const { command, args } = parsed;
        try {
            switch (command) {
                case 'tag':
                    await handleTag(message, args);
                    break;
                case 'addtag':
                    await handleAddTag(message, args);
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
            console.error(e);
            message.reply('Internal error.');
        }
    }
}
