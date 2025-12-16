import { DatabaseContainer, type DatabaseResolver } from "./containers/Database";
import { DiscordContainer, type DiscordResolver } from "./containers/Discord";
import { RepositoryContainer, type RepositoryResolver } from "./containers/Repository";
import { ServicesContainer, type ServicesResolver } from "./containers/Services";

export class Dependencies {
    readonly database: DatabaseResolver;
    readonly discord: DiscordResolver;
    readonly services: ServicesResolver;
    readonly repositories: RepositoryResolver;

    constructor(
        database: DatabaseResolver,
        discord: DiscordResolver,
        services: ServicesResolver,
        repositories: RepositoryResolver,
    ) {
        this.database = database;
        this.discord = discord;
        this.services = services;
        this.repositories = repositories;
    }

    resetAll(): void {
        this.database.reset();
        this.discord.reset();
        this.services.reset();
    }
}

export const dependencies = new Dependencies(
    new DatabaseContainer(),
    new DiscordContainer(),
    new ServicesContainer(),
    new RepositoryContainer(),
);
