import { app } from './../core/App';
import { Repository, Entity, DataSource } from 'typeorm';
import { CategoryTable } from '../db/entities/Category';
import { CategoryTagTable } from '../db/entities/CategoryTag';
import { HostTable } from '../db/entities/Host';
import { HostAliasTable } from '../db/entities/HostAlias';
import { TagTable } from '../db/entities/Tag';
import { TagAliasTable } from '../db/entities/TagAlias';
import { TagOverridesTable } from '../db/entities/TagOverrides';
import { TagHostTable } from '../db/entities/TagHost';
import { UserTable } from '../db/entities/User';
import { UserHostTable } from '../db/entities/UserHost';
import { ValidEntity } from '../db/types/entities';

let dbHandler: DbHandler | null = null;

export class DbHandler {
    categoryRepo: Repository<CategoryTable>;
    categoryTagRepo: Repository<CategoryTagTable>;
    hostRepo: Repository<HostTable>;
    hostAliasRepo: Repository<HostAliasTable>;
    tagRepo: Repository<TagTable>;
    tagAliasRepo: Repository<TagAliasTable>;
    TagOverrideRepo: Repository<TagOverridesTable>;
    tagHostRepo: Repository<TagHostTable>;
    userRepo: Repository<UserTable>;
    userHostRepo: Repository<UserHostTable>;

    constructor(appDataSource: DataSource) {
        // Initialize all repos. Yes, this is ugly but I don't want recursion either.
        this.categoryRepo = appDataSource.getRepository(CategoryTable);
        this.categoryTagRepo = appDataSource.getRepository(CategoryTagTable);
        this.hostRepo = appDataSource.getRepository(HostTable);
        this.hostAliasRepo = appDataSource.getRepository(HostAliasTable);
        this.tagRepo = appDataSource.getRepository(TagTable);
        this.tagAliasRepo = appDataSource.getRepository(TagAliasTable);
        this.TagOverrideRepo = appDataSource.getRepository(TagOverridesTable);
        this.tagHostRepo = appDataSource.getRepository(TagHostTable);
        this.userRepo = appDataSource.getRepository(UserTable);
        this.userHostRepo = appDataSource.getRepository(UserHostTable);
    }

    async createNewTag(
        tagName: string,
        tagBody: string,
        tagOwner: UserTable,
        host: HostTable,
    ): Promise<Number> {
        /* Get:
         * 1. Tag Name
         * 2. Tag Body
         * 3. Tag Owner
         * 4. Host to save to
         */
        /* Find:
         * 1. If tag exists in the DB, in which case, fail with code 1
         */
        /* Save:
         * 1. Tag
         * 2. TagOverrides
         * 3. TagHost
         */
        return 0;
    }

    async findOrCreateUser(userDiscordId: string): Promise<UserTable> {
        let user = await this.userRepo.findOneBy({
            discordId: userDiscordId,
        });
        if (!user) {
            user = this.userRepo.create({
                discordId: userDiscordId,
            });
            await this.saveEntity(user);
        }
        return user;
    }

    async findHost(guildId: string): Promise<HostTable | null> {
        const host = this.hostRepo.findOneBy({
            discordId: guildId,
        });
        if (!host) return null;
        return host;
    }

    async findUserAndHost(
        userDiscordId: string,
        guildId: string | null,
    ): Promise<{ user: UserTable; host: HostTable; userHost: UserHostTable } | null> {
        if (!guildId) return null;
        const user = await this.findOrCreateUser(userDiscordId);
        const host = await this.findHost(guildId);
        if (!host) return null;

        const userHost = await this.userHostRepo.findOneBy({
            user: user,
            host: host,
        });
        if (!userHost) return null;

        return { user: user, host: host, userHost: userHost };
    }

    async saveEntity(entity: ValidEntity) {
        const entityRepo = this.repoFromEntity(entity);
        await entityRepo.save(entity);
    }

    repoFromEntity(entity: ValidEntity) {
        return app.database.dataSource.getRepository(entity.constructor as any);
    }
}

export async function initDbHandler(): Promise<DbHandler> {
    if (dbHandler) return dbHandler;
    const ds = app.database.dataSource;
    dbHandler = new DbHandler(ds);
    return dbHandler;
}

export function getDbHandler(): DbHandler {
    if (!dbHandler) throw new Error('DB not initialized. Call initDbHandler() first.');
    return dbHandler;
}
