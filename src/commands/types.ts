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
    info?: {
        usage: string;
        examples?: string[];
    };
};
