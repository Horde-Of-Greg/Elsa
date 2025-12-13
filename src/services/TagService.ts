import { app } from "../core/App";
import type { TagRepository, TagElements, TagHostElements } from "../db/repositories/TagRepository";
import { computeSHA256, type SHA256Hash } from "../utils/crypto/sha256Hash";
import type { TagTable } from "../db/entities/Tag";
import type { Guild, User } from "discord.js";

export class TagService {
    private tagRepo: TagRepository;

    constructor() {
        this.tagRepo = app.database.tagRepo;
    }

    async createTag(context: {
        tagName: string;
        tagBody: string;
        tagBodyHash: SHA256Hash;
        author: User;
        guild: Guild;
    }) {
        const authorUser = await app.services.userService.findOrCreateUser(context.author);
        const hostRecord = await app.services.hostService.findOrCreateHost(
            context.guild.id,
            context.guild.name,
        );

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
}
