import { Cache } from "../../caching/Cache";
import type { TagTable } from "../../db/entities/Tag";
import type { UserTable } from "../../db/entities/User";
import { DeletedTagNotFound, TagNotFoundError } from "../../errors/client/404";
import type { ConfigsResolver } from "../../types/config/config";
import type {
    CacheContainerResolver,
    FormatterContainerResolver,
    RepositoryContainerResolver,
    ServicesContainerResolver,
} from "../../types/core/containers";
import type { SHA256Hash } from "../../types/crypto";
import type { TagElements, TagHostElements, TagRepositoryResolver } from "../../types/db/repositories";
import type { HostServiceResolver } from "../../types/services/host";
import type { CreateTagContext, TagServiceResolver } from "../../types/services/tag";
import type { UserServiceResolver } from "../../types/services/user";
import { computeSHA256 } from "../../utils/crypto/sha256Hash";

export class TagService implements TagServiceResolver {
    private readonly tagRepo: TagRepositoryResolver;
    private readonly userService: UserServiceResolver;
    private readonly hostService: HostServiceResolver;
    private readonly deletionMemory: Cache<TagTable>;

    constructor(
        repositories: RepositoryContainerResolver,
        services: ServicesContainerResolver,
        cacheContainer: CacheContainerResolver,
        private readonly formatter: FormatterContainerResolver,
        private readonly configs: ConfigsResolver,
    ) {
        this.tagRepo = repositories.tagRepo;
        this.userService = services.userService;
        this.hostService = services.hostService;

        this.deletionMemory = new Cache(
            "deletion_memory",
            this.configs.app.COMMANDS.UNDELETE.DELAY_S,
            true,
            cacheContainer,
            this.configs,
        );
    }

    async createTag(context: CreateTagContext): Promise<TagTable> {
        const authorUser = await this.userService.findOrCreateUser(context.author);
        const hostRecord = await this.hostService.findOrCreateHost(context.guild.id, context.guild.name);

        const elements: TagElements = {
            name: context.tagName,
            body: context.tagBody,
            bodyHash: context.tagBodyHash,
            author: authorUser,
        };
        const hostStatus: TagHostElements = {
            host: hostRecord,
        };

        return this.tagRepo.createAndSaveTag(elements, hostStatus);
    }

    async createAlias(
        aliasName: string,
        context: { tagToAlias: string; type: "literal" } | { tagToAlias: TagTable; type: "object" },
        aliasAuthor: UserTable,
    ): Promise<TagTable> {
        if (context.type === "literal") {
            const tagToAlias = await this.tagRepo.findByName(context.tagToAlias);
            if (tagToAlias === null) {
                throw new TagNotFoundError(context.tagToAlias, true, this.configs);
            }
            return this.tagRepo.createAlias(aliasName, tagToAlias, aliasAuthor);
        }
        const tagToAlias = context.tagToAlias;
        return this.tagRepo.createAlias(aliasName, tagToAlias, aliasAuthor);
    }

    async updateTag(context: {
        tagName: string;
        tagBody: string;
        tagBodyHash: SHA256Hash;
    }): Promise<TagTable> {
        const tag = await this.tagRepo.findByName(context.tagName);
        if (tag === null) {
            throw new TagNotFoundError(context.tagName, true, this.configs);
        }
        tag.body = context.tagBody;
        tag.bodyHash = context.tagBodyHash;
        return this.tagRepo.forceUpdateOne(tag);
    }

    async deleteTag(tagName?: string, tag?: TagTable): Promise<void> {
        if (tag === undefined) {
            if (tagName === undefined) {
                throw new TagNotFoundError("unknown", true, this.configs);
            }
            const foundTag = await this.findTag(tagName);
            if (foundTag === null) {
                throw new TagNotFoundError(tagName, true, this.configs);
            }
            await this.tagRepo.deleteTag(foundTag);
            return;
        }
        await this.deletionMemory.set(tag.name, tag);
        await this.tagRepo.deleteTag(tag);
    }

    async retrieveTag(tagName: string): Promise<TagTable> {
        const tag = await this.deletionMemory.get(tagName);
        if (tag === null) {
            throw new DeletedTagNotFound(tagName, this.formatter);
        }
        return tag;
    }

    async tagExists(name: string): Promise<boolean> {
        return this.tagRepo.tagExistsByName(name);
    }

    async tagBodyExists(
        body: string,
    ): Promise<{ exists: true; tagWithBody: TagTable } | { exists: false; hash: SHA256Hash }> {
        const hash: SHA256Hash = computeSHA256(body);
        const tagWithBody = await this.tagRepo.findByHash(hash);

        if (tagWithBody === null) return { exists: false, hash };
        return { exists: true, tagWithBody };
    }

    async findTag(name: string): Promise<TagTable | null> {
        return this.tagRepo.findByNameOrAlias(name);
    }

    async findTagStrict(name: string): Promise<TagTable | null> {
        return this.tagRepo.findByName(name);
    }
}
