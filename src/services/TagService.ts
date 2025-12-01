import { ta } from 'zod/v4/locales';
import { app } from '../core/App';
import { ErrorProne } from '../core/errors/ErrorProne';
import { HostRepository } from '../db/repositories/HostRepository';
import { TagRepository, TagElements, TagHostElements } from '../db/repositories/TagRepository';
import { UserRepository } from '../db/repositories/UserRepository';

export class TagService extends ErrorProne {
    tagRepo: TagRepository;
    userRepo: UserRepository;
    hostRepo: HostRepository;

    constructor() {
        super();
        this.tagRepo = app.database.tagRepo;
        this.userRepo = app.database.userRepo;
        this.hostRepo = app.database.hostRepo;
    }

    async createTag(elements: TagElements, hostStatus: TagHostElements) {
        if (!hostStatus.status) {
        }
        return this.tagRepo.createAndSaveTag(elements, hostStatus);
    }
}
