import { Repository, Entity } from 'typeorm';
import { AppDataSource } from '../db/dataSource';
import { CategoryTable } from '../db/entities/Category';
import { CategoryTagTable } from '../db/entities/CategoryTag';
import { HostTable } from '../db/entities/Host';
import { HostAliasTable } from '../db/entities/HostAlias';
import { TagTable } from '../db/entities/Tag';
import { TagAliasTable } from '../db/entities/TagAlias';
import { TagElementTable } from '../db/entities/TagElement';
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
    tagElementRepo: Repository<TagElementTable>;
    tagHostRepo: Repository<TagHostTable>;
    userRepo: Repository<UserTable>;
    userHostRepo: Repository<UserHostTable>;

    constructor(private readonly appDataSource: typeof AppDataSource) {
        // Initialize all repos. Yes, this is ugly but I don't want recursion either.
        this.categoryRepo = AppDataSource.getRepository(CategoryTable);
        this.categoryTagRepo = AppDataSource.getRepository(CategoryTagTable);
        this.hostRepo = AppDataSource.getRepository(HostTable);
        this.hostAliasRepo = AppDataSource.getRepository(HostAliasTable);
        this.tagRepo = AppDataSource.getRepository(TagTable);
        this.tagAliasRepo = AppDataSource.getRepository(TagAliasTable);
        this.tagElementRepo = AppDataSource.getRepository(TagElementTable);
        this.tagHostRepo = AppDataSource.getRepository(TagHostTable);
        this.userRepo = AppDataSource.getRepository(UserTable);
        this.userHostRepo = AppDataSource.getRepository(UserHostTable);
    }

    getDataSource() {
        return this.appDataSource;
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
         * 2. TagElements
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
        }
        return user;
    }

    async saveEntity(entity: ValidEntity) {
        const entityRepo = this.repoFromEntity(entity);
        await entityRepo.save(entity);
    }

    repoFromEntity(entity: ValidEntity) {
        return AppDataSource.getRepository(entity as any);
    }
}

export async function initDbHandler(): Promise<DbHandler> {
    if (dbHandler) return dbHandler;
    const ds = await AppDataSource.initialize();
    dbHandler = new DbHandler(ds);
    return dbHandler;
}

export function getDbHandler(): DbHandler {
    if (!dbHandler) throw new Error('DB not initialized. Call initDbHandler() first.');
    return dbHandler;
}
