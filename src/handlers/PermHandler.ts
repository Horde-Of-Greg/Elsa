import { Repository } from 'typeorm';
import { config } from '../config/config';
import { UserHostTable } from '../db/entities/UserHost';
import { UserTable } from '../db/entities/User';
import { HostTable } from '../db/entities/Host';
import { app } from '../core/App';

let permHandler: PermHandler | null = null;

export class PermHandler {
    userRepo: Repository<UserTable>;
    userHostRepo: Repository<UserHostTable>;
    hostRepo: Repository<HostTable>;

    tagPermLevel: Number;
    addTagPermLevel: Number;
    setRankPermLevel: Number;

    constructor() {
        this.userRepo = app.database.dataSource.getRepository(UserTable);
        this.userHostRepo = app.database.dataSource.getRepository(UserHostTable);
        this.hostRepo = app.database.dataSource.getRepository(HostTable);

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

export async function initPermHandler(): Promise<PermHandler> {
    if (permHandler) return permHandler;
    permHandler = new PermHandler();
    return permHandler;
}

export function getPermHandler(): PermHandler {
    if (!permHandler) throw new Error('DB not initialized. Call initPermHandler() first.');
    return permHandler;
}
