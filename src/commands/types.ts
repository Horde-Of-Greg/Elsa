import { Message, User, Guild, Channel } from 'discord.js';
import { PermLevel } from '../db/entities/UserHost';

export type CommandContext = {
    message: Message;
    author: User;
    guild: Guild;
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
    cooldown_s: number;
    info: {
        description: string;
        arguments?: ArgumentDefinition[];
        examples?: string[];
    };
};

export type RequirableParseResult = Exclude<keyof ParseResult, 'command' | 'server'>;

export type ArgumentDefinition = {
    name: string;
    required: boolean;
    parseResultKey: RequirableParseResult;
};
