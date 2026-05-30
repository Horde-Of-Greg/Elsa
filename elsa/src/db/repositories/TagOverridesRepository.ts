import type { DatabaseContainerResolver } from "../../types/core/containers";
import type { TagOverridesRepositoryResolver } from "../../types/db/repositories";
import type { HostTable } from "../entities/Host";
import type { TagTable } from "../entities/Tag";
import { TagOverridesTable } from "../entities/TagOverrides";
import { BaseRepository } from "./BaseRepository";

export class TagOverridesRepository
    extends BaseRepository<TagOverridesTable>
    implements TagOverridesRepositoryResolver
{
    constructor(databaseContainer: DatabaseContainerResolver) {
        super(TagOverridesTable, databaseContainer);
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
