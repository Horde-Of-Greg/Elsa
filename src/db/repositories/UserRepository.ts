import { BaseRepository } from '../repositories/BaseRepository';
import { UserTable } from '../entities/User';
import { HostTable } from '../entities/Host';
import { PermLevel, UserHostTable } from '../entities/UserHost';
import { Snowflake } from 'discord.js';

export class UserRepository extends BaseRepository<UserTable> {
    constructor() {
        super(UserTable);
    }

    async findByDiscordId(discordId: string): Promise<UserTable | null> {
        return this.findOne({ discordId });
    }

    async findOrCreateByDiscordId(discordId: Snowflake, name?: string): Promise<UserTable> {
        let user = await this.findByDiscordId(discordId);
        if (!user) {
            user = this.create({
                discordId,
                name,
            });
            await this.save(user);
        }
        return user;
    }

    async getPermLevel(user: UserTable, host: HostTable): Promise<PermLevel | null> {
        const userHost = await this.findOneByJoin(UserHostTable, user, host);
        return userHost?.permLevel ?? null;
    }

    async createPermLevel(user: UserTable, host: HostTable, permLevel: PermLevel) {
        await this.createAndSaveOnOtherTable(UserHostTable, {
            userId: user.id,
            hostId: host.id,
            permLevel,
        });
    }
}
