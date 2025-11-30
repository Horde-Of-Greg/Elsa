import { BaseRepository } from './BaseRepository';
import { UserTable } from '../entities/User';
import { HostTable } from '../entities/Host';
import { PermLevel, UserHostTable } from '../entities/UserHost';
import { StandardError } from '../../types/errors/StandardError';

export class UserRepository extends BaseRepository<UserTable> {
    constructor() {
        super(UserTable);
    }

    async findByDiscordId(discordId: string): Promise<UserTable | null> {
        return this.findOne({ discordId });
    }

    async findOrCreate(discordId: string): Promise<UserTable> {
        let user = await this.findByDiscordId(discordId);
        if (!user) {
            user = this.create({ discordId });
            await this.save(user);
        }
        return user;
    }

    async getPermLevel(user: UserTable, host: HostTable): Promise<PermLevel | null> {
        const userHost = await this.findOneByJoin(UserHostTable, user, host);
        return userHost?.permLevel ?? null;
    }
}
