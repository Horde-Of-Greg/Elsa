import { Repository } from 'typeorm';
import { AppDataSource } from '../db/dataSource';
import { config } from '../config/config';
import { UserHostTable } from '../db/entities/UserHost';
import { UserTable } from '../db/entities/User';
import { HostTable } from '../db/entities/Host';

export class PermHandler {
    userRepo: Repository<UserTable>;
    userHostRepo: Repository<UserHostTable>;
    hostRepo: Repository<HostTable>;

    tagPermLevel: Number;
    addTagPermLevel: Number;
    setRankPermLevel: Number;

    constructor() {
        this.userRepo = AppDataSource.getRepository(UserTable);
        this.userHostRepo = AppDataSource.getRepository(UserHostTable);
        this.hostRepo = AppDataSource.getRepository(HostTable);

        this.tagPermLevel = config.CMD_RANKS.TAG;
        this.addTagPermLevel = config.CMD_RANKS.ADD_TAG;
        this.setRankPermLevel = config.CMD_RANKS.SET_RANK;
    }

    async getRankByHost(user: UserTable, host: HostTable): Promise<number> {
        const row = await this.userHostRepo.findOne({
            where: { user: { id: Number(user.id) }, host: { id: host.id } },
            select: { permLevel: true },
            relations: { user: false, host: false },
        });
        return row?.permLevel ?? 0;
    }

    async userCanUseTags(user: UserTable, host: HostTable) {
        return (await this.getRankByHost(user, host)) === this.tagPermLevel;
    }

    async userCanCreateTags(user: UserTable, host: HostTable) {
        return (await this.getRankByHost(user, host)) === this.addTagPermLevel;
    }

    async userCanSetRanks(
        user: UserTable,
        host: HostTable,
        targetUser: UserTable,
        targetRank: Number,
    ) {
        return (await this.getRankByHost(user, host)) === this.setRankPermLevel;
    }
}
