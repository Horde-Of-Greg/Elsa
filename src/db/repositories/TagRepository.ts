import { BaseRepository } from './BaseRepository';
import { TagTable } from '../entities/Tag';
import { UserTable } from '../entities/User';
import { TagHostStatus } from '../entities/TagHost';

export class TagRepository extends BaseRepository<TagTable> {
    constructor() {
        super(TagTable);
    }

    async findAllByAuthor(author: UserTable): Promise<TagTable[]> {
        return this.findAll({ authorId: author.id });
    }

    async findByName(name: string): Promise<TagTable | null> {
        return this.findOne({ name });
    }

    async findByAlias(aliasName: string): Promise<TagTable | null> {
        return await this.repo
            .createQueryBuilder('tag')
            .innerJoin('tag.aliases', 'alias')
            .where('alias.name = :name', { name: aliasName })
            .getOne();
    }

    async findByNameOrAlias(nameOrAlias: string) {
        let tag = this.findByName(nameOrAlias);
        if (!tag) tag = this.findByAlias(nameOrAlias);
        return tag;
    }

    async findWithRelations(id: number): Promise<TagTable | null> {
        return this.repo.findOne({
            where: { id },
            relations: ['elements', 'author', 'tagHosts'],
        });
    }
}
