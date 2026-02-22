import { EmbedBuilder } from "@discordjs/builders";

import { PermLevel } from "../../../db/entities/UserHost";
import type { Versions } from "../../../types/command";
import { fetchLatestRemoteTag } from "../../../utils/github/tags";
import { getSemVer } from "../../../utils/node/version";
import { ensureStrictPositive } from "../../../utils/numbers/positive";
import { CommandDef, CommandInstance } from "../../Command";

export class CommandVersionDef extends CommandDef<Versions, CommandVersionInstance> {
    constructor() {
        super(
            {
                name: "version",
                aliases: ["v"],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: -1,
                    guild: -1,
                },
                info: {
                    description: "Returns the SemVer version of the bot.",
                },
                hideFromHelp: true,
            },
            CommandVersionInstance,
            {
                useCache: true,
                clear: true,
                ttl_s: ensureStrictPositive(60),
            },
        );
    }
}

export class CommandVersionInstance extends CommandInstance<Versions> {
    protected async validateData(): Promise<void> {}

    protected async execute(): Promise<Versions> {
        return {
            local: await getSemVer(),
            remote: await fetchLatestRemoteTag(),
        };
    }

    protected async reply(): Promise<void> {
        await this.context.message.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle("Version Information")
                    .setDescription(
                        `**Local**: \`${this.content.local}\`\n` +
                            `**[GitHub](https://github.com/Horde-Of-Greg/Elsa/releases/tag/${this.content.remote})**: \`${this.content.remote}\``,
                    ),
            ],
        });
    }

    protected logExecution(): void {}
}
