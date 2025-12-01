import { Client } from 'discord.js';
import { BotEventHandler } from '../../bot/BotEventHandler';
import { BotClient } from '../../client/BotClient';

export class DiscordContainer {
    private _botClient?: BotClient;
    private _eventHandler?: BotEventHandler;

    get botClient(): BotClient {
        return (this._botClient ??= new BotClient());
    }

    get dcClient(): Client {
        return this.botClient.dcClient;
    }

    get eventHandler(): BotEventHandler {
        if (!this.botClient) {
            throw new Error('Bot Event Handler initialized before Bot Client');
        }
        return (this._eventHandler ??= new BotEventHandler(this.dcClient));
    }

    reset(): void {
        this._botClient = undefined;
        this._eventHandler = undefined;
    }
}
