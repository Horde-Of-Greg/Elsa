import { CoreContainer } from './containers/Core';
import { DatabaseContainer } from './containers/Database';
import { DiscordContainer } from './containers/Discord';

export class AppContainer {
    readonly core = new CoreContainer();
    readonly database = new DatabaseContainer();
    readonly discord = new DiscordContainer();

    resetAll(): void {
        this.core.reset();
        this.database.reset();
        this.discord.reset();
    }
}

export const app = new AppContainer();
