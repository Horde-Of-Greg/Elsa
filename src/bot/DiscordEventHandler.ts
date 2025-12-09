import { Client, ClientEvents } from 'discord.js';
import { CommandRouter } from '../commands/CommandRouter';

export abstract class DiscordEventHandler<K extends keyof ClientEvents> {
    abstract readonly eventName: K;
    abstract readonly once: boolean;

    abstract handle(...args: ClientEvents[K]): Promise<void> | void;

    protected client!: Client;
    protected router!: CommandRouter;

    setDependencies(client: Client, router: CommandRouter): void {
        this.client = client;
        this.router = router;
    }
}
