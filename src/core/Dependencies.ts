import { CacheContainer, type CacheResolver } from "./containers/Cache.js";
import { DatabaseContainer, type DatabaseResolver } from "./containers/Database.js";
import { DiscordContainer, type DiscordResolver } from "./containers/Discord.js";
import { RepositoryContainer, type RepositoryResolver } from "./containers/Repository.js";
import { ServicesContainer, type ServicesResolver } from "./containers/Services.js";

class Dependencies {
    readonly database: DatabaseResolver;
    readonly discord: DiscordResolver;
    readonly services: ServicesResolver;
    readonly repositories: RepositoryResolver;
    readonly cache: CacheResolver;

    constructor(
        cache: CacheResolver,
        database: DatabaseResolver,
        discord: DiscordResolver,
        services: ServicesResolver,
        repositories: RepositoryResolver,
    ) {
        this.cache = cache;
        this.database = database;
        this.discord = discord;
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
    new ServicesContainer(),
    new RepositoryContainer(),
);
