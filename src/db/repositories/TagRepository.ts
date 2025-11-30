import { BaseRepository } from './BaseRepository';
import { TagTable } from '../entities/Tag';
import { UserTable } from '../entities/User';
import { TagHostStatus, TagHostTable } from '../entities/TagHost';
import { TagAliasTable } from '../entities/TagAlias';
import { FindOptionsRelations } from 'typeorm';
import { HostTable } from '../entities/Host';
import { CategoryTable } from '../entities/Category';
import { CategoryTagTable } from '../entities/CategoryTag';

export class TagRepository extends BaseRepository<TagTable> {
    constructor() {
        super(TagTable);
    }

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
        const tagHosts = await this.findAllByJoin(TagHostTable, host, { status });
        const tags: TagTable[] = [];
        for (const tagHost of tagHosts) {
            tags.push(tagHost.tag);
        }
        return tags;
    }

    async findAllByHostName(hostName: string, status?: TagHostStatus): Promise<TagTable[] | null> {
        const host = await this.findOneOnOtherTable(HostTable, { name: hostName });
        if (!host) return null;
        return this.findAllByHost(host, status);
    }

    async findAllByCategory(category: CategoryTable): Promise<TagTable[]> {
        const categoryTags = await this.findAllByJoin(CategoryTagTable, category);
        const tags: TagTable[] = [];
        for (const categoryTag of categoryTags) {
            tags.push(categoryTag.tag);
        }
        return tags;
    }

    async findAllByCategoryName(categoryName: string): Promise<TagTable[] | null> {
        const category = await this.findOneOnOtherTable(HostTable, { name: categoryName });
        if (!category) return null;
        return this.findAllByHost(category);
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
        let tag = this.findByName(nameOrAlias);
        if (!tag) tag = this.findByAlias(nameOrAlias);
        return tag;
    }

    async findWithRelations(id: number): Promise<TagTable | null> {
        return this.findOne({ id }, { overrides: true, author: true, tagHosts: true });
    }
}
