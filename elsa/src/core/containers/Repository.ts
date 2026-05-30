import { HostRepository } from "../../db/repositories/HostRepository";
import { TagOverridesRepository } from "../../db/repositories/TagOverridesRepository";
import { TagRepository } from "../../db/repositories/TagRepository";
import { UserRepository } from "../../db/repositories/UserRepository";
import type { DatabaseContainerResolver, RepositoryContainerResolver } from "../../types/core/containers";

export class RepositoryContainer implements RepositoryContainerResolver {
    private _tagRepo?: TagRepository;
    private _userRepo?: UserRepository;
    private _hostRepo?: HostRepository;
    private _tagOverridesRepo?: TagOverridesRepository;

    constructor(private readonly databaseContainer: DatabaseContainerResolver) {}

    get tagRepo(): TagRepository {
        return (this._tagRepo ??= new TagRepository(this.databaseContainer));
    }

    get userRepo(): UserRepository {
        return (this._userRepo ??= new UserRepository(this.databaseContainer));
    }

    get hostRepo(): HostRepository {
        return (this._hostRepo ??= new HostRepository(this.databaseContainer));
    }

    get tagOverridesRepo(): TagOverridesRepository {
        return (this._tagOverridesRepo ??= new TagOverridesRepository(this.databaseContainer));
    }

    reset(): void {
        this._tagRepo = undefined;
        this._userRepo = undefined;
        this._hostRepo = undefined;
        this._tagOverridesRepo = undefined;
    }
}
