import { Channel, Guild, Message, User } from 'discord.js';
import { PermLevel } from '../db/entities/UserHost';
import { ErrorProne } from '../core/errors/ErrorProne';
import { config } from '../config/config';

export type CommandContext = {
    message: Message;
    author: User;
    guild: Guild | null;
    channel: Channel;
};

export type ParseResult = {
    command: string;
    server?: string;
    subcommand?: string;
    args?: string[];
};

export type CommandParams = {
    name: string;
    aliases: string[];
    permLevelRequired: PermLevel;
    cooldown: number;
    info?: {
        usage: string;
        examples?: string[];
    };
};

export abstract class BaseCommand extends ErrorProne {
    constructor(private params: CommandParams) {
        super();
    }

    match(context: CommandContext): boolean {
        const pattern = `^${config.PREFIX}([a-z0-9]+)`;
        const matcher = new RegExp(pattern, 'i');
        const matched = context.message.content.match(matcher);

        if (!matched) return false;

        return this.matchesIdentifier(matched[1]);
    }

    parse(context: CommandContext): ParseResult | null {
        const pattern = [
            '^', // Start of string
            config.PREFIX, // Prefix in config
            '([a-z0-9]+)', // First word up to anything that is not a-z or 0-9
            '(?:-([a-z0-9]*))?', // (optional) Word after "-""
            '(?:\\s(\\w+))?', // (optional) Word after " "
            '(?:\\s([\\w\\s]+))?', // (optional) Any words left
            '$', // End of string
        ].join('');

        const matcher = new RegExp(pattern, 'i');
        const parsed = context.message.content.match(matcher);

        if (!parsed) return null;

        /*
         * Example parsing: !tag-nomi oc 1
         *
         * match        name        optional?       Match in example
         * --------------------------------------------------------------------------
         * null         prefix      Necessary       Matches "!"" (if ! is set as the prefix)
         * 1            command     Necessary       Matches "tag"
         * 2            server      Optional        Matches "nomi"
         * 3            subcommand  Optional        Matches "oc"
         * 4            args        Optional        Matches "30 10 15 5"
         */
        return {
            command: parsed[1],
            server: parsed[2],
            subcommand: parsed[3],
            args: parsed[4]?.split(/\s+/),
        };
    }

    abstract run(context: CommandContext, parseResult: ParseResult): Promise<void>;

    /**
     * Get all command identifiers (name + aliases).
     */
    private getIdentifiers(): string[] {
        return this.params.aliases.concat(this.params.name);
    }

    private matchesIdentifier(identifier: string): boolean {
        return this.getIdentifiers().includes(identifier.toLowerCase());
    }
}
