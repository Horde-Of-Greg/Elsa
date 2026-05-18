import type { ConfigsResolver } from "../config/config";
import type { Resettable } from "../general";
import type { TimerRegistryResolver } from "../time/timer";
import type {
    CacheContainerResolver,
    ConsoleContainerResolver,
    DatabaseContainerResolver,
    DiscordContainerResolver,
    FormatterContainerResolver,
    RepositoryContainerResolver,
    ServicesContainerResolver,
} from "./containers";
import type { LoggerResolver } from "./logs";

type EnsureResettables<T extends Record<string, Resettable>> = T;

export type DependencyParams = EnsureResettables<{
    cache: CacheContainerResolver;
    configs: ConfigsResolver;
    consoles: ConsoleContainerResolver;
    database: DatabaseContainerResolver;
    discord: DiscordContainerResolver;
    formatter: FormatterContainerResolver;
    logger: LoggerResolver;
    repositories: RepositoryContainerResolver;
    services: ServicesContainerResolver;
    timers: TimerRegistryResolver;
}>;

export interface DependenciesResolver {
    cache: CacheContainerResolver;
    configs: ConfigsResolver;
    consoles: ConsoleContainerResolver;
    database: DatabaseContainerResolver;
    discord: DiscordContainerResolver;
    formatter: FormatterContainerResolver;
    logger: LoggerResolver;
    repositories: RepositoryContainerResolver;
    services: ServicesContainerResolver;
    timers: TimerRegistryResolver;
}
