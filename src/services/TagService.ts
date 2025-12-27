import type { Guild, User } from "discord.js";

import type { RepositoryResolver } from "../core/containers/Repository";
import type { ServicesResolver } from "../core/containers/Services";
import { dependencies } from "../core/Dependencies";
import type { TagTable } from "../db/entities/Tag";
import type { UserTable } from "../db/entities/User";
import type { TagRepository } from "../db/repositories/TagRepository";
import { TagNotFoundError } from "../errors/client/404";
import type { SHA256Hash } from "../types/crypto";
import type { TagElements, TagHostElements } from "../types/db/repositories";
import { computeSHA256 } from "../utils/crypto/sha256Hash";
import type { HostService } from "./HostService";
import type { UserService } from "./UserService";

export class TagService {
    private tagRepo: TagRepository;
    private userService: UserService;
    private hostService: HostService;

    constructor(
        repositories: RepositoryResolver = dependencies.repositories,
        services: ServicesResolver = dependencies.services,
    ) {
        this.tagRepo = repositories.tagRepo;
        this.userService = services.userService;
        this.hostService = services.hostService;
    }

    async createTag(context: {
        tagName: string;
        tagBody: string;
        tagBodyHash: SHA256Hash;
        author: User;
        guild: Guild;
    }) {
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
    ) {
        let tagToAlias: TagTable;
        if (context.type === "literal") {
            const tagCandidate = await this.tagRepo.findByName(context.tagToAlias);
            if (tagCandidate === null) {
                throw new TagNotFoundError(context.tagToAlias, true);
            }
            tagToAlias = tagCandidate;
        } else {
            tagToAlias = context.tagToAlias;
        }

        return this.tagRepo.createAlias(aliasName, tagToAlias, aliasAuthor);
    }

    async updateTag(context: { tagName: string; tagBody: string; tagBodyHash: SHA256Hash }) {
        const tag = await this.tagRepo.findByName(context.tagName);
        if (!tag) {
            throw new TagNotFoundError(context.tagName, true);
        }
        tag.body = context.tagBody;
        tag.bodyHash = context.tagBodyHash;
        return this.tagRepo.forceUpdateOne(tag);
    }

    async deleteTag(tagName?: string, tag?: TagTable) {
        if (tag === undefined) {
            if (tagName === undefined) {
                throw new TagNotFoundError("unknown", true);
            }
            const foundTag = await this.findTag(tagName);
            if (foundTag === null) {
                throw new TagNotFoundError(tagName, true);
            }
            await this.tagRepo.deleteTag(foundTag);
            return;
        }
        await this.tagRepo.deleteTag(tag);
    }

    async tagExists(name: string): Promise<boolean> {
        return this.tagRepo.tagExistsByName(name);
    }

    async tagBodyExists(
        body: string,
    ): Promise<{ exists: true; tagWithBody: TagTable } | { exists: false; hash: SHA256Hash }> {
        const hash: SHA256Hash = computeSHA256(body);
        const tagWithBody = await this.tagRepo.findByHash(hash);

        if (!tagWithBody) return { exists: false, hash };
        return { exists: true, tagWithBody };
    }

    async findTag(name: string) {
        return this.tagRepo.findByNameOrAlias(name);
    }

    async findTagStrict(name: string) {
        return this.tagRepo.findByName(name);
    }
}
