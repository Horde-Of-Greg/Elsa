import { Message } from 'discord.js';
import { AppDataSource } from '../db/dataSource';
import { HostTable } from '../db/entities/Host';
import { TagTable } from '../db/entities/Tag';
import { TagOverrideTable } from '../db/entities/TagOverrides';
export async function executeTag(tagName: string, host: HostTable, message: Message) {
    const TagOverridesRepo = AppDataSource.getRepository(TagOverrideTable);

    const TagOverrides = await TagOverridesRepo.findOneBy({
        name: tagName,
    });
    if (!TagOverrides) {
        message.reply('Could not find tag');
        return;
    }
    message.reply(TagOverrides.body);
}
