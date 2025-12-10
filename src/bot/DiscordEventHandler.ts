import { Client, ClientEvents } from 'discord.js';
import { CommandRouter } from '../commands/CommandRouter';

export abstract class DiscordEventHandler<K extends keyof ClientEvents> {
    abstract readonly eventName: K;
    abstract readonly once: boolean;

    abstract handle(...args: ClientEvents[K]): Promise<void> | void;

    protected client!: Client;
    protected router!: CommandRouter;

    register(client: Client, router: CommandRouter): void {
        this.client = client;
        this.router = router;
        if (this.once) {
            this.client.once(this.eventName, (...args) => this.handle(...args));
        } else {
            this.client.on(this.eventName, (...args) => this.handle(...args));
        }
    }
}
