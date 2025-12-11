import type { Message, User, Guild, Channel } from 'discord.js';
import type { PermLevel } from '../db/entities/UserHost';
import type { PositiveNumber } from '../utils/numbers/positive';

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
    cooldowns: { channel: validCooldown; guild: validCooldown };
    info: {
        description: string;
        arguments?: ArgumentDefinition[];
        examples?: string[];
    };
};

export type validCooldown = PositiveNumber | 'disabled';

export type RequirableParseResult = Exclude<keyof ParseResult, 'command' | 'server'>;

export type ArgumentDefinition = {
    name: string;
    required: boolean;
    parseResultKey: RequirableParseResult;
};

export type CooldownKeys = {
    channel: string;
    guild: string;
};
