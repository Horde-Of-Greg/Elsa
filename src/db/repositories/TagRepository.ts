import { BaseRepository } from './BaseRepository';
import { TagTable } from '../entities/Tag';
import { UserTable } from '../entities/User';
import { TagHostStatus, TagHostTable } from '../entities/TagHost';
import { TagAliasTable } from '../entities/TagAlias';
import { FindOptionsRelations } from 'typeorm';
import { HostTable } from '../entities/Host';
import { CategoryTable } from '../entities/Category';
import { CategoryTagTable } from '../entities/CategoryTag';
import { SHA256Hash } from '../../utils/crypto/sha256Hash';

export type TagElements = {
    name: string;
    body: string;
    bodyHash: SHA256Hash;
    author: UserTable;
};

export type TagHostElements = {
    host: HostTable;
    status?: TagHostStatus;
};

export class TagRepository extends BaseRepository<TagTable> {
    constructor() {
        super(TagTable);
    }

    /*
     * Create
     */

    createTag(elements: TagElements): TagTable {
        return this.create({
            name: elements.name,
            body: elements.body,
            bodyHash: elements.bodyHash,
            authorId: elements.author.id,
            isScript: false, //TODO: impl script tags
        });
    }

    createManyTags(elements: TagElements[]): TagTable[] {
        const tags = [];
        for (const element of elements) {
            tags.push(
                this.create({
                    name: element.name,
                    body: element.body,
                    bodyHash: element.bodyHash,
                    authorId: element.author.id,
                    isScript: false, //TODO: impl script tags
                }),
            );
        }
        return tags;
    }

    async saveTag(tag: TagTable, elements: TagHostElements): Promise<TagTable> {
        await this.save(tag);

        const tagHost = this.createOnOtherTable(TagHostTable, {
            tagId: tag.id,
            hostId: elements.host.id,
            status: elements.status ?? TagHostStatus.PENDING,
        });
        await this.saveOnOtherTable(tagHost);

        return tag;
    }

    async saveManyTags(elements: Map<TagTable, TagHostElements>): Promise<TagTable[]> {
        const tags = Array.from(elements.keys());

        await this.saveMany(tags);

        const tagHosts = tags.map((tag) => {
            const hostElements = elements.get(tag)!;
            return this.createOnOtherTable(TagHostTable, {
                tagId: tag.id,
                hostId: hostElements.host.id,
                status: hostElements.status ?? TagHostStatus.PENDING,
            });
        });

        await this.saveManyOnOtherTable(tagHosts);

        return tags;
    }

    async createAndSaveTag(
        elements: TagElements,
        statusOnHost: TagHostElements,
    ): Promise<TagTable> {
        return this.saveTag(this.createTag(elements), statusOnHost);
    }

    async createAndSaveManyTags(elements: Map<TagElements, TagHostElements>): Promise<TagTable[]> {
        const entries = Array.from(elements.entries());
        const tags = entries.map(([tagElements]) => this.createTag(tagElements));

        await this.saveMany(tags);

        const tagHosts = tags.map((tag, index) => {
            const [_, hostElements] = entries[index];
            return this.createOnOtherTable(TagHostTable, {
                tagId: tag.id,
                hostId: hostElements.host.id,
                status: hostElements.status ?? TagHostStatus.PENDING,
            });
        });

        await this.saveManyOnOtherTable(tagHosts);

        return tags;
    }

    /*
     * Read
     */

    async findAllByAuthor(author: UserTable): Promise<TagTable[]> {
        return this.findAll({ authorId: author.id });
    }

    async findAllByAuthorName(authorName: string): Promise<TagTable[] | null> {
        const author = await this.findOneOnOtherTable(UserTable, { name: authorName });
        if (!author) return null;

        return this.findAllByAuthor(author);
    }

    async findAllByAuthorDId(authorDId: string): Promise<TagTable[] | null> {
        const author = await this.findOneOnOtherTable(UserTable, { discordId: authorDId });
        if (!author) return null;

        return this.findAllByAuthor(author);
    }

    async findAllByHost(host: HostTable, status?: TagHostStatus): Promise<TagTable[]> {
        const tagHosts = await this.findAllByJoin(TagHostTable, host, { status }, { tag: true });

        return tagHosts.map((th) => th.tag);
    }

    async findAllByHostName(hostName: string, status?: TagHostStatus): Promise<TagTable[] | null> {
        const host = await this.findOneOnOtherTable(HostTable, { name: hostName });
        if (!host) return null;

        return this.findAllByHost(host, status);
    }

    async findAllByCategory(category: CategoryTable): Promise<TagTable[]> {
        const categoryTags = await this.findAllByJoin(CategoryTagTable, category, undefined, {
            tag: true,
        });

        return categoryTags.map((ct) => ct.tag);
    }

    async findAllByCategoryName(categoryName: string): Promise<TagTable[] | null> {
        const category = await this.findOneOnOtherTable(CategoryTable, { name: categoryName });
        if (!category) return null;

        return this.findAllByCategory(category);
    }

    async findByName(name: string): Promise<TagTable | null> {
        return this.findOne({ name });
    }

    async findByAlias(aliasName: string): Promise<TagTable | null> {
        const tagAlias = await this.findOneOnOtherTable(
            TagAliasTable,
            { name: aliasName },
            {
                tag: true,
            },
        );

        return tagAlias?.tag ?? null;
    }

    async findByNameOrAlias(nameOrAlias: string): Promise<TagTable | null> {
        let tag = await this.findByName(nameOrAlias);
        if (!tag) tag = await this.findByAlias(nameOrAlias);
        return tag;
    }

    async findWithRelations(id: number): Promise<TagTable | null> {
        return this.findOne({ id }, { overrides: true, author: true, tagHosts: true });
    }

    async findByHash(hash: SHA256Hash) {
        return this.findOne({ bodyHash: hash });
    }

    async hashExists(hash: SHA256Hash) {
        return this.exists({ bodyHash: hash });
    }

    async tagExistsByName(name: string) {
        return this.exists({ name });
    }

    /*
     * Update
     */

    async safeUpdateOne(tag: TagTable): Promise<boolean> {
        if (await this.exists({ id: tag.id })) {
            return false;
        }
        await this.save(tag);
        return true;
    }

    async safeUpdateMany(tags: TagTable[]): Promise<void> {
        tags.filter((tag) => !this.exists({ id: tag.id }));
        await this.saveMany(tags);
    }

    async forceUpdateOne(tag: TagTable): Promise<void> {
        await this.save(tag);
    }

    async forceUpdateMany(tags: TagTable[]): Promise<void> {
        await this.saveMany(tags);
    }

    async banTagOnHost(tag: TagTable, host: HostTable): Promise<TagTable | null> {
        const tagHost = await this.findOneByJoin(TagHostTable, tag, host);
        if (!tagHost) return null;
        if (tagHost.status === TagHostStatus.BANNED) return null;
        tagHost.status = TagHostStatus.BANNED;
        this.saveOnOtherTable(tagHost);
        return tag;
    }

    async banManyTagsOnHost(tags: TagTable[], host: HostTable): Promise<TagTable[]> {
        const tagHosts: TagHostTable[] = [];
        for (const tag of tags) {
            const tagHost = await this.findOneByJoin(TagHostTable, tag, host);
            if (!tagHost) continue;
            tagHost.status = TagHostStatus.BANNED;
            tagHosts.push(tagHost);
        }
        this.saveManyOnOtherTable(tagHosts);
        return tags;
    }

    /*
     * Delete
     */
}
