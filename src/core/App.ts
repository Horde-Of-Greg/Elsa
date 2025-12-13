import { CoreContainer } from "./containers/Core";
import { DatabaseContainer } from "./containers/Database";
import { DiscordContainer } from "./containers/Discord";
import { ServicesContainer } from "./containers/Services";

export class AppContainer {
    readonly core = new CoreContainer();
    readonly database = new DatabaseContainer();
    readonly discord = new DiscordContainer();
    readonly services = new ServicesContainer();

    resetAll(): void {
        this.core.reset();
        this.database.reset();
        this.discord.reset();
        this.services.reset();
    }
}

export const app = new AppContainer();
