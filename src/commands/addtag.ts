import { Message } from 'discord.js';
import { config } from '../config/config';
import { promises as fs } from 'fs';
import path from 'path';
import { UserTable } from '../db/entities/User';
import { AppDataSource } from '../db/dataSource';
import { TagTable } from '../db/entities/Tag';
import { TagOverridesTable } from '../db/entities/TagOverrides';
import { TagHostStatus, TagHostTable } from '../db/entities/TagHost';
import { HostTable } from '../db/entities/Host';
import { getDbHandler } from '../handlers/DbHandler';

export async function addTag(
    tagName: string,
    body: string,
    user: UserTable,
    host: HostTable,
    message: Message,
): Promise<void> {
    getDbHandler().createNewTag(tagName, body, user, host);

    await message.reply(`Tag ${tagName} created.`);
}
