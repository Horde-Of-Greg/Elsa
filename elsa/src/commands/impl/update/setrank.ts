import type { Message, User } from "discord.js";

import { PermLevel } from "../../../assets/db/permLevel";
import { BadArgumentError } from "../../../errors/client/400";
import type { DependenciesResolver } from "../../../types/core/dependencies";
import { getUserById } from "../../../utils/discord/users";
import { CommandDef, CommandInstance } from "../../Command";
import type { Commands } from "../../Commands";

export class CommandSetRankDef extends CommandDef<void, CommandSetRankInstance> {
    constructor(dependencies: DependenciesResolver, commands: Commands) {
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
                    description:
                        "Edits the rank of someone. You must have higher permissions than the user you are editing the rank of, and cannot give a permission level higher than yours.",
                    arguments: [
                        {
                            name: "user-id",
                            required: true,
                            parseResultKey: "subcommand",
                            description: "The Discord User ID of the user you wish to change the rank of.",
                        },
                        {
                            name: "new-rank",
                            required: true,
                            parseResultKey: "args",
                            description: "The new rank to give to the user.",
                        },
                    ],
                },
            },
            CommandSetRankInstance,
            {
                useCache: false,
            },
            dependencies,
            commands,
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

    protected async reply(): Promise<Message> {
        return this.context.message.reply(
            `Successfully updated <@${this.user.id}>'s rank to ${PermLevel[this.newRank]} ${this.dependencies.configs.emoji.CHECKMARK}`,
        );
    }

    protected async postReply(sentMessage: Message): Promise<void> {}

    protected logExecution(): void {
        this.dependencies.logger.warnUser(
            `Successfully updated ${this.user.username}'s rank to ${PermLevel[this.newRank]}`,
        );
    }

    private async ensureUserExists(): Promise<void> {
        const user_dc = await getUserById(this.userId, this.dependencies.discord.bot);
        this.user = user_dc;
    }
}
