import { HostRepository } from "../../db/repositories/HostRepository.js";
import { TagOverridesRepository } from "../../db/repositories/TagOverridesRepository.js";
import { TagRepository } from "../../db/repositories/TagRepository.js";
import { UserRepository } from "../../db/repositories/UserRepository.js";

export interface RepositoryResolver {
    get tagRepo(): TagRepository;
    get userRepo(): UserRepository;
    get hostRepo(): HostRepository;
    get tagOverridesRepo(): TagOverridesRepository;
    reset(): void;
}

export class RepositoryContainer {
    private _tagRepo?: TagRepository;
    private _userRepo?: UserRepository;
    private _hostRepo?: HostRepository;
    private _tagOverridesRepo?: TagOverridesRepository;

    get tagRepo(): TagRepository {
        return (this._tagRepo ??= new TagRepository());
    }

    get userRepo(): UserRepository {
        return (this._userRepo ??= new UserRepository());
    }

    get hostRepo(): HostRepository {
        return (this._hostRepo ??= new HostRepository());
    }

    get tagOverridesRepo(): TagOverridesRepository {
        return (this._tagOverridesRepo ??= new TagOverridesRepository());
    }

    reset(): void {
        this._tagRepo = undefined;
        this._userRepo = undefined;
        this._hostRepo = undefined;
        this._tagOverridesRepo = undefined;
    }
}
