import { Message } from 'discord.js';
import { config } from '../config/config';
import { UserTable } from '../db/entities/User';
import { AppDataSource } from '../db/dataSource';
import { PermLevel, UserHostTable } from '../db/entities/UserHost';
import assert from 'assert';
export async function setRank(targetUser: UserTable, newRank: PermLevel) {
    const userHostRepo = AppDataSource.getRepository(UserHostTable);

    const userHost = await userHostRepo.findOneBy({
        user: targetUser,
    });
    assert(userHost, 'Could Not Find User Host');

    userHost.permLevel = newRank;
    await userHostRepo.save(userHost);
}
