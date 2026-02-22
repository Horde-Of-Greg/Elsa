import { DiscordBot } from "../../bot/DiscordBot.js";

export interface DiscordResolver {
    get bot(): DiscordBot;
    reset(): void;
}

export class DiscordContainer {
    private _bot?: DiscordBot;

    get bot(): DiscordBot {
        return (this._bot ??= new DiscordBot());
    }

    reset(): void {
        this._bot = undefined;
    }
}
