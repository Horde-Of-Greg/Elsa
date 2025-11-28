import { BaseRepository } from './BaseRepository';
import { TagOverridesTable } from '../entities/TagOverrides';
import { TagTable } from '../entities/Tag';
import { HostTable } from '../entities/Host';

export class TagOverridesRepository extends BaseRepository<TagOverridesTable> {
    constructor() {
        super(TagOverridesTable);
    }

    async findOverride(tag: TagTable, host: HostTable): Promise<TagOverridesTable | null> {
        return this.findOne({ tagId: tag.id, tagHostId: host.id });
    }

    async findAllByTag(tag: TagTable): Promise<TagOverridesTable[]> {
        return this.findAll({ tagId: tag.id });
    }

    async findAllByHost(host: HostTable): Promise<TagOverridesTable[]> {
        return this.findAll({ tagHostId: host.id });
    }
}
