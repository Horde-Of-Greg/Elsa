import type { ConfigsResolver } from "../types/config/config";
import type {
    CacheContainerResolver,
    ConsoleContainerResolver,
    DatabaseContainerResolver,
    DiscordContainerResolver,
    FormatterContainerResolver,
    RepositoryContainerResolver,
    ServicesContainerResolver,
} from "../types/core/containers";
import type { DependenciesResolver, DependencyParams } from "../types/core/dependencies";
import type { LoggerResolver } from "../types/core/logs";
import type { TimerRegistryResolver } from "../types/time/timer";

export class Dependencies implements DependenciesResolver {
    readonly cache: CacheContainerResolver;
    readonly configs: ConfigsResolver;
    readonly consoles: ConsoleContainerResolver;
    readonly database: DatabaseContainerResolver;
    readonly discord: DiscordContainerResolver;
    readonly formatter: FormatterContainerResolver;
    readonly logger: LoggerResolver;
    readonly repositories: RepositoryContainerResolver;
    readonly services: ServicesContainerResolver;
    readonly timers: TimerRegistryResolver;

    constructor(params: DependencyParams) {
        this.cache = params.cache;
        this.configs = params.configs;
        this.consoles = params.consoles;
        this.database = params.database;
        this.discord = params.discord;
        this.formatter = params.formatter;
        this.logger = params.logger;
        this.repositories = params.repositories;
        this.services = params.services;
        this.timers = params.timers;
    }

    async resetAll(): Promise<void> {
        this.configs.reset();
        await this.logger.reset();
        this.cache.reset();
        await this.consoles.reset();
        this.database.reset();
        this.discord.reset();
        this.repositories.reset();
        this.services.reset();
        this.timers.reset();
    }
}
