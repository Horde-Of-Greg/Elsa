import { CacheContainer, type CacheResolver } from "./containers/Cache";
import { DatabaseContainer, type DatabaseResolver } from "./containers/Database";
import { DiscordContainer, type DiscordResolver } from "./containers/Discord";
import { FormatterContainer, type FormatterResolver } from "./containers/Formatter";
import { RepositoryContainer, type RepositoryResolver } from "./containers/Repository";
import { ServicesContainer, type ServicesResolver } from "./containers/Services";

class Dependencies {
    readonly database: DatabaseResolver;
    readonly discord: DiscordResolver;
    readonly services: ServicesResolver;
    readonly repositories: RepositoryResolver;
    readonly cache: CacheResolver;
    readonly formatter: FormatterResolver;

    constructor(
        cache: CacheResolver,
        database: DatabaseResolver,
        discord: DiscordResolver,
        formatter: FormatterResolver,
        services: ServicesResolver,
        repositories: RepositoryResolver,
    ) {
        this.cache = cache;
        this.database = database;
        this.discord = discord;
        this.formatter = formatter;
        this.services = services;
        this.repositories = repositories;
    }

    resetAll(): void {
        this.cache.reset();
        this.database.reset();
        this.discord.reset();
        this.services.reset();
        this.repositories.reset();
    }
}

export const dependencies = new Dependencies(
    new CacheContainer(),
    new DatabaseContainer(),
    new DiscordContainer(),
    new FormatterContainer(),
    new ServicesContainer(),
    new RepositoryContainer(),
);
