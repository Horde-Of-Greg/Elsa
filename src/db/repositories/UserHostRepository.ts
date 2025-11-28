import { BaseRepository } from './BaseRepository';
import { UserHostTable, PermLevel } from '../entities/UserHost';
import { UserTable } from '../entities/User';
import { HostTable } from '../entities/Host';

export class UserHostRepository extends BaseRepository<UserHostTable> {
    constructor() {
        super(UserHostTable);
    }

    async findByUserAndHost(user: UserTable, host: HostTable): Promise<UserHostTable | null> {
        return this.findOne({
            userId: user.id,
            hostId: host.id,
        });
    }

    async findOrCreate(user: UserTable, host: HostTable): Promise<UserHostTable> {
        let userHost = await this.findByUserAndHost(user, host);
        if (!userHost) {
            userHost = this.create({
                user,
                host,
                permLevel: PermLevel.DEFAULT,
            });
            await this.save(userHost);
        }
        return userHost;
    }

    async getPermLevel(user: UserTable, host: HostTable): Promise<PermLevel | null> {
        const userHost = await this.repo.findOne({
            where: { userId: user.id, hostId: host.id },
            select: { permLevel: true },
        });
        return userHost?.permLevel ?? null;
    }

    async findAllByUser(user: UserTable): Promise<UserHostTable[]> {
        return this.repo.find({
            where: { userId: user.id },
            relations: ['host'],
        });
    }
}
