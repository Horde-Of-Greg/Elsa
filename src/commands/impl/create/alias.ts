import { core } from "../../../core/Core";
import { PermLevel } from "../../../db/entities/UserHost";
import { CommandDef, CommandInstance } from "../../Command";

export class CommandAliasDef extends CommandDef<void, CommandAliasInstance> {
    constructor() {
        super(
            {
                name: "alias",
                aliases: [],
                permLevelRequired: PermLevel.DEFAULT,
                cooldowns: {
                    channel: -1,
                    guild: -1,
                },
                info: {
                    description: "PLACEHOLDER",
                },
            },
            CommandAliasInstance,
            {
                useCache: false,
            },
        );
    }
}

export class CommandAliasInstance extends CommandInstance<void> {

    protected async validateData(): Promise<void> {}

    protected async execute(): Promise<void> {}

    protected async reply(): Promise<void> {}

    protected logExecution(): void {
        core.logger.debug(`You forgot to change the default values of ${this.params.name}`);
    }
}