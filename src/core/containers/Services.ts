import { CooldownService } from "../../services/CooldownService";
import { HostService } from "../../services/HostService";
import { PermissionsService } from "../../services/PermsService";
import { TagService } from "../../services/TagService";
import { UserService } from "../../services/UserService";

export interface ServicesResolver {
    get cooldownService(): CooldownService;
    get hostService(): HostService;
    get permsService(): PermissionsService;
    get tagService(): TagService;
    get userService(): UserService;
    reset(): void;
}

export class ServicesContainer {
    private _cooldownService?: CooldownService;
    private _hostService?: HostService;
    private _permsService?: PermissionsService;
    private _tagService?: TagService;
    private _userService?: UserService;

    get cooldownService(): CooldownService {
        return (this._cooldownService ??= new CooldownService());
    }

    get hostService(): HostService {
        return (this._hostService ??= new HostService());
    }

    get permsService(): PermissionsService {
        return (this._permsService ??= new PermissionsService());
    }

    get tagService(): TagService {
        return (this._tagService ??= new TagService());
    }

    get userService(): UserService {
        return (this._userService ??= new UserService());
    }

    reset(): void {
        this._cooldownService = undefined;
        this._permsService = undefined;
        this._tagService = undefined;
        this._hostService = undefined;
        this._userService = undefined;
    }
}
