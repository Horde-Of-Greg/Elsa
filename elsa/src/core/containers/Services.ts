import { CooldownService } from "../../services/commands/CooldownService";
import { HostService } from "../../services/commands/HostService";
import { PermissionsService } from "../../services/commands/PermissionsService";
import { TagService } from "../../services/commands/TagService";
import { UserService } from "../../services/commands/UserService";
import { MessageLinkService } from "../../services/discord/MessageLinkService";
import type { ConfigsResolver } from "../../types/config/config";
import type {
    CacheContainerResolver,
    FormatterContainerResolver,
    RepositoryContainerResolver,
    ServicesContainerResolver,
} from "../../types/core/containers";
import type { CooldownServiceResolver } from "../../types/services/cooldown";
import type { HostServiceResolver } from "../../types/services/host";
import type { MessageLinkServiceResolver } from "../../types/services/messageLink";
import type { PermissionsServiceResolver } from "../../types/services/permissions";
import type { TagServiceResolver } from "../../types/services/tag";
import type { UserServiceResolver } from "../../types/services/user";

export class ServicesContainer implements ServicesContainerResolver {
    private _cooldownService?: CooldownServiceResolver;
    private _hostService?: HostServiceResolver;
    private _permsService?: PermissionsServiceResolver;
    private _tagService?: TagServiceResolver;
    private _userService?: UserServiceResolver;
    private _messageLinkService?: MessageLinkServiceResolver;

    constructor(
        private readonly cache: CacheContainerResolver,
        private readonly repositories: RepositoryContainerResolver,
        private readonly formatter: FormatterContainerResolver,
        private readonly configs: ConfigsResolver,
    ) {}

    get cooldownService(): CooldownServiceResolver {
        return (this._cooldownService ??= new CooldownService(this.cache, this.configs));
    }

    get hostService(): HostServiceResolver {
        return (this._hostService ??= new HostService(this.repositories));
    }

    get permsService(): PermissionsServiceResolver {
        return (this._permsService ??= new PermissionsService(this.repositories, this.configs));
    }

    get tagService(): TagServiceResolver {
        return (this._tagService ??= new TagService(
            this.repositories,
            this,
            this.cache,
            this.formatter,
            this.configs,
        ));
    }

    get userService(): UserServiceResolver {
        return (this._userService ??= new UserService(this.repositories, this));
    }

    get messageLinkService(): MessageLinkServiceResolver {
        return (this._messageLinkService ??= new MessageLinkService(this.cache, this.configs));
    }

    reset(): void {
        this._cooldownService = undefined;
        this._permsService = undefined;
        this._tagService = undefined;
        this._hostService = undefined;
        this._userService = undefined;
        this._messageLinkService = undefined;
    }
}
