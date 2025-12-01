import { PermissionsService } from '../../services/PermsService';
import { TagService } from '../../services/TagService';

export class ServicesContainer {
    private _permsService?: PermissionsService;
    private _tagService?: TagService;

    get permsService(): PermissionsService {
        return (this._permsService ??= new PermissionsService());
    }

    get tagService(): TagService {
        return (this._tagService ??= new TagService());
    }

    reset(): void {
        this._permsService = undefined;
        this._tagService = undefined;
    }
}
