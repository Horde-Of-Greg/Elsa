import type { User } from "discord.js";

import { emojis } from "../../../config/config";
import { core } from "../../../core/Core";
import { PermLevel } from "../../../db/entities/UserHost";
import { BadArgumentError } from "../../../errors/client/400";
import { DiscordUserNotFound } from "../../../errors/client/404";
import { getUserById } from "../../../utils/discord/users";
import { CommandDef, CommandInstance } from "../../Command";

export class CommandSetRankDef extends CommandDef<void, CommandSetRankInstance> {
    constructor() {
        super(
            {
                name: "setrank",
                aliases: ["sr", "srank"],
                permLevelRequired: PermLevel.OWNER,
                cooldowns: {
                    channel: -1,
                    guild: -1,
                },
                info: {
                    description: "Edits the rank of someone",
                    arguments: [
                        { name: "user-id", required: true, parseResultKey: "subcommand" },
                        { name: "new-rank", required: true, parseResultKey: "args" },
                    ],
                },
            },
            CommandSetRankInstance,
            {
                useCache: false,
            },
        );
    }
}

class CommandSetRankInstance extends CommandInstance<void> {
    private userId!: string;
    private newRank!: PermLevel;
    private user!: User;

    protected async validateData(): Promise<void> {
        this.userId = this.arg<string>("user-id");
        const newRank = this.arg<string[]>("new-rank")[0].toUpperCase();

        await this.ensureUserExists();

        if (!(newRank in PermLevel)) {
            const validRanks = Object.keys(PermLevel).filter((k) => isNaN(Number(k)));
            throw new BadArgumentError("New Rank", validRanks, newRank, false);
        }

        this.newRank = PermLevel[newRank as keyof typeof PermLevel];
        await this.permsService.requirePermLevel(this.context.author, this.context.guild, this.newRank);
    }
    protected async execute(): Promise<void> {
        await this.userService.createUserWithPerms(this.user, this.context.guild, this.newRank);
    }
    protected async reply(): Promise<void> {
        await this.context.message.reply(
            `Successfully updated <@${this.user.id}>'s rank to ${PermLevel[this.newRank]} ${emojis.CHECKMARK}`,
        );
    }
    protected logExecution(): void {
        core.logger.warnUser(
            `Successfully updated ${this.user.username}'s rank to ${PermLevel[this.newRank]}`,
        );
    }

    private async ensureUserExists() {
        const user_dc = await getUserById(this.userId);
        if (!user_dc) {
            throw new DiscordUserNotFound({ type: "user id", value: this.userId });
        }
        this.user = user_dc;
    }
}
