import { Message } from 'discord.js';
import { AppDataSource } from '../db/dataSource';
import { HostTable } from '../db/entities/Host';
import { TagTable } from '../db/entities/Tag';
import { TagElementTable } from '../db/entities/TagElement';
export async function executeTag(tagName: string, host: HostTable, message: Message) {
    const tagElementsRepo = AppDataSource.getRepository(TagElementTable);

    const tagElements = await tagElementsRepo.findOneBy({
        name: tagName,
    });
    if (!tagElements) {
        message.reply('Could not find tag');
        return;
    }
    message.reply(tagElements.body);
}
