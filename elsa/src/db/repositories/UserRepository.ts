import type { Snowflake } from "discord.js";

import type { PermLevel } from "../../assets/db/permLevel";
import type { DatabaseContainerResolver } from "../../types/core/containers";
import type { UserRepositoryResolver } from "../../types/db/repositories";
import type { HostTable } from "../entities/Host";
import { UserTable } from "../entities/User";
import { UserHostTable } from "../entities/UserHost";
import { BaseRepository } from "./BaseRepository";

export class UserRepository extends BaseRepository<UserTable> implements UserRepositoryResolver {
    constructor(databaseContainer: DatabaseContainerResolver) {
        super(UserTable, databaseContainer);
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

    async createPermLevel(
        user: UserTable,
        host: HostTable,
        permLevel: PermLevel,
    ): Promise<{ user: UserTable; perm: PermLevel }> {
        const userhost = await this.createAndSaveOnOtherTable(UserHostTable, {
            userId: user.id,
            hostId: host.id,
            permLevel,
        });
        return { user: userhost.user, perm: userhost.permLevel };
    }

    async updateOrCreatePermLevel(
        user: UserTable,
        host: HostTable,
        permLevel: PermLevel,
    ): Promise<{ user: UserTable; perm: PermLevel }> {
        const existingUserHost = await this.findOneByJoin(UserHostTable, user, host);

        if (existingUserHost) {
            existingUserHost.permLevel = permLevel;
            const newUserHost = await this.saveOnOtherTable(existingUserHost);
            return { user: newUserHost.user, perm: newUserHost.permLevel };
        }

        return this.createPermLevel(user, host, permLevel);
    }

    async getPermLevel(user: UserTable, host: HostTable): Promise<PermLevel | null> {
        const userHost = await this.findOneByJoin(UserHostTable, user, host);
        return userHost?.permLevel ?? null;
    }
}
