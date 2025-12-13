import type { DataSource } from "typeorm";

import { dataSourceappConfig } from "../../db/dataSource";
import { HostRepository } from "../../db/repositories/HostRepository";
import { TagOverridesRepository } from "../../db/repositories/TagOverridesRepository";
import { TagRepository } from "../../db/repositories/TagRepository";
import { UserRepository } from "../../db/repositories/UserRepository";

export class DatabaseContainer {
    private _tagRepo?: TagRepository;
    private _userRepo?: UserRepository;
    private _hostRepo?: HostRepository;
    private _tagOverridesRepo?: TagOverridesRepository;
    private _dataSource?: DataSource;

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

    get dataSource(): DataSource {
        return (this._dataSource ??= dataSourceappConfig());
    }

    reset(): void {
        this._tagRepo = undefined;
        this._userRepo = undefined;
        this._hostRepo = undefined;
        this._tagOverridesRepo = undefined;
    }
}
