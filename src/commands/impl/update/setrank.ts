import { PermLevel } from "../../../db/entities/UserHost";
import { CommandDef, CommandInstance } from "../../Command";

export class CommandSetRankDef extends CommandDef<CommandSetRankInstance> {
    constructor() {
        super(
            {
                name: "setrank",
                aliases: ["sr", "srank"],
                permLevelRequired: PermLevel.OWNER,
                cooldowns: {
                    channel: "disabled",
                    guild: "disabled",
                },
                info: {
                    description: "Edits the rank of someone",
                    //TODO: Impl
                },
            },
            CommandSetRankInstance,
        );
    }
}

class CommandSetRankInstance extends CommandInstance {
    protected async validateData(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    protected execute(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    protected reply(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    protected logExecution(): void {}
}
