import { DataSource } from 'typeorm';
import { dataSourceConfig } from '../../db/dataSource';
import { HostRepository } from '../../db/repositories/HostRepository';
import { TagOverridesRepository } from '../../db/repositories/TagOverridesRepository';
import { TagRepository } from '../../db/repositories/TagRepository';
import { UserRepository } from '../../db/repositories/UserRepository';
import { DbHandler } from '../../handlers/DbHandler';
import { PermHandler } from '../../handlers/PermHandler';

export class DatabaseContainer {
    private _tagRepo?: TagRepository;
    private _userRepo?: UserRepository;
    private _hostRepo?: HostRepository;
    private _tagOverridesRepo?: TagOverridesRepository;
    private _dataSource?: DataSource;

    //TODO: Remove these
    private _dbHandler?: DbHandler;
    private _permHandler?: PermHandler;

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
        return (this._dataSource ??= dataSourceConfig());
    }

    //TODO: See above
    get dbHandler(): DbHandler {
        return (this._dbHandler ??= new DbHandler(this.dataSource));
    }

    get permHandler(): PermHandler {
        return (this._permHandler ??= new PermHandler());
    }

    reset(): void {
        this._tagRepo = undefined;
        this._userRepo = undefined;
        this._hostRepo = undefined;
        this._tagOverridesRepo = undefined;
        this._dbHandler = undefined;
        this._permHandler = undefined;
    }
}
