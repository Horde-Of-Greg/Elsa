import { app } from '../core/App';
import { HostRepository } from '../db/repositories/HostRepository';
import { TagRepository, TagElements, TagHostElements } from '../db/repositories/TagRepository';
import { UserRepository } from '../db/repositories/UserRepository';
import { computeSHA256, SHA256Hash } from '../utils/crypto/sha256Hash';
import { TagTable } from '../db/entities/Tag';
import { Guild, User } from 'discord.js';

export class TagService {
    private tagRepo: TagRepository;
    private userRepo: UserRepository;
    private hostRepo: HostRepository;

    constructor() {
        this.tagRepo = app.database.tagRepo;
        this.userRepo = app.database.userRepo;
        this.hostRepo = app.database.hostRepo;
    }

    async createTag(context: {
        tagName: string;
        tagBody: string;
        tagBodyHash: SHA256Hash;
        author: User;
        guild: Guild;
    }) {
        const elements: TagElements = {
            name: context.tagName,
            body: context.tagBody,
            bodyHash: context.tagBodyHash,
            author: await this.userRepo.findOrCreateByDiscordId(context.author.id),
        };
        const hostStatus: TagHostElements = {
            host: await this.hostRepo.findOrCreateByDiscordId(context.guild.id, context.guild.name),
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
        return this.tagRepo.findByName(name);
    }
}
