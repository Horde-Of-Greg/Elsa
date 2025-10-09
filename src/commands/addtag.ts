import { Message } from 'discord.js';
import { config } from '../config/config';
import { promises as fs } from 'fs';
import path from 'path';
import { UserTable } from '../db/entities/User';
import { AppDataSource } from '../db/dataSource';
import { TagTable } from '../db/entities/Tag';
import { TagElementTable } from '../db/entities/TagElement';
import { TagHostStatus, TagHostTable } from '../db/entities/TagHost';
import { HostTable } from '../db/entities/Host';

export async function addTag(
    tagName: string,
    body: string,
    host: HostTable,
    user: UserTable,
): Promise<void> {
    const tagRepo = AppDataSource.getRepository(TagTable);
    const tagElementsRepo = AppDataSource.getRepository(TagElementTable);
    const tagHostRepo = AppDataSource.getRepository(TagHostTable);

    const tagElements = tagElementsRepo.create({
        name: tagName,
        body: body,
    });

    const tag = tagRepo.create({
        author: user,
        elements: [tagElements],
    });

    const tagHost = tagHostRepo.create({
        host: host,
        tag: tag,
        status: TagHostStatus.PENDING,
    });

    await tagRepo.save(tag);
    await tagElementsRepo.save(tagElements);
    await tagHostRepo.save(tagHost);
}
