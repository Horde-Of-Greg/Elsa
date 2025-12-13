import type { Guild, User } from "discord.js";
import { app } from "../core/App";
import { PermLevel } from "../db/entities/UserHost";
import type { HostRepository } from "../db/repositories/HostRepository";
import type { UserRepository } from "../db/repositories/UserRepository";
import { PermissionDeniedError } from "../core/errors/client/403";

export class PermissionsService {
    private userRepo: UserRepository;
    private hostRepo: HostRepository;

    constructor() {
        this.userRepo = app.database.userRepo;
        this.hostRepo = app.database.hostRepo;
    }

    async requirePermLevel(user: User, host: Guild, permRequired: PermLevel): Promise<void> {
        const user_db = await this.userRepo.findOrCreateByDiscordId(user.id);

        const host_db = await this.hostRepo.findOrCreateByDiscordId(host.id, host.name);

        const userPerm = await this.userRepo.getPermLevel(user_db, host_db);

        if (userPerm === null) {
            await this.userRepo.createPermLevel(user_db, host_db, PermLevel.DEFAULT);
            if (PermLevel.DEFAULT < permRequired) {
                throw new PermissionDeniedError(permRequired, PermLevel.DEFAULT, user_db);
            }
            return;
        }

        if (userPerm < permRequired) {
            throw new PermissionDeniedError(permRequired, userPerm, user_db);
        }
    }
}
