import type { Console } from "console";
import type { DataSource } from "typeorm";

import type { CacheRegistry } from "../../caching/CacheRegistry";
import type { RedisClient } from "../../caching/RedisClient";
import type { AppFormatter } from "../../config/formatters/AppFormatter";
import type {
    HostRepositoryResolver,
    TagOverridesRepositoryResolver,
    TagRepositoryResolver,
    UserRepositoryResolver,
} from "../db/repositories";
import type { DiscordBotResolver } from "../discord/bot";
import type { Resettable } from "../general";
import type { CooldownServiceResolver } from "../services/cooldown";
import type { HostServiceResolver } from "../services/host";
import type { MessageLinkServiceResolver } from "../services/messageLink";
import type { PermissionsServiceResolver } from "../services/permissions";
import type { TagServiceResolver } from "../services/tag";
import type { UserServiceResolver } from "../services/user";

export interface CacheContainerResolver extends Resettable {
    get client(): RedisClient;
    get registry(): CacheRegistry;
}

export interface DatabaseContainerResolver extends Resettable {
    get dataSource(): DataSource;
}

export interface DiscordContainerResolver extends Resettable {
    get bot(): DiscordBotResolver;
}

export interface FormatterContainerResolver extends Resettable {
    app: AppFormatter;
}

export interface RepositoryContainerResolver extends Resettable {
    get tagRepo(): TagRepositoryResolver;
    get userRepo(): UserRepositoryResolver;
    get hostRepo(): HostRepositoryResolver;
    get tagOverridesRepo(): TagOverridesRepositoryResolver;
}

export interface ServicesContainerResolver extends Resettable {
    get cooldownService(): CooldownServiceResolver;
    get hostService(): HostServiceResolver;
    get permsService(): PermissionsServiceResolver;
    get tagService(): TagServiceResolver;
    get userService(): UserServiceResolver;
    get messageLinkService(): MessageLinkServiceResolver;
}

export interface ConsoleContainerResolver {
    get terminalConsole(): Console;
    get debugTerminalConsole(): Console;
    get fileConsole(): Console;
    get debugFileConsole(): Console;
    get appConsole(): Console;
    get debugConsole(): Console;

    start(): void;
    stop(): Promise<void>;
    shutdown(): Promise<void>;
    reset(): Promise<void>;

    archiveLogs(): Promise<void>;
    clearLogs(): Promise<void>;
}
