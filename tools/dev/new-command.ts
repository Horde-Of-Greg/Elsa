/* eslint-disable no-console */
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const commandRegistryPath = path.join(process.cwd(), "src", "commands", "Commands.ts");

let cmdName: string;
let filePath: string;
let crudType: string;

async function main() {
    cmdName = await askCmdName();
    crudType = await askCrudType();
    filePath = path.join(
        process.cwd(),
        "src",
        "commands",
        "impl",
        crudType,
        `${cmdName.replace("-", "")}.ts`,
    );
    await write();
    await updateCommandsRegistry();
    execSync("npm run lint:fix");
    rl.close();
}

function askCmdName(): Promise<string> {
    return new Promise((resolve) => {
        rl.question("Enter the name of the new command\n>", (answer) => {
            if (!/^[a-z-]+$/.test(answer)) {
                console.warn("Invalid command name. Must match [a-z-]+");
                resolve(askCmdName());
            } else {
                resolve(answer);
            }
        });
    });
}

function askCrudType(): Promise<string> {
    return new Promise((resolve) => {
        rl.question("Enter type of the command (create/delete/read/update)\n>", (answer) => {
            if (!["create", "delete", "read", "update"].includes(answer)) {
                console.warn("Invalid command type. Must be create/delete/read/update.");
                resolve(askCrudType());
            } else {
                resolve(answer);
            }
        });
    });
}

async function write() {
    const text = (CmdName: string, cmd_name: string) => `import { core } from "../../../core/Core";
import { PermLevel } from "../../../db/entities/UserHost";
import { CommandDef, CommandInstance } from "../../Command";

export class Command${CmdName}Def extends CommandDef<void, Command${CmdName}Instance> {
    constructor() {
        super(
            {
                name: "${cmd_name.replace("-", "")}",
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
            Command${CmdName}Instance,
            {
                useCache: false,
            },
        );
    }
}

export class Command${CmdName}Instance extends CommandInstance<void> {

    protected async validateData(): Promise<void> {}

    protected async execute(): Promise<void> {}

    protected async reply(): Promise<void> {}

    protected logExecution(): void {
        core.logger.debug(\`You forgot to change the default values of \${this.params.name}\`);
    }
}`;
    await fs.promises.writeFile(filePath, text(capitalizeWithDashes(cmdName), cmdName));
    console.info(`wrote to ${filePath} successfully!`);
}

function capitalizeWithDashes(input: string) {
    const split = input.split("");
    for (let i = 0; i < split.length; i++) {
        if (i === 0) split[i] = split[i].toUpperCase();
        if (split[i] === "-") split[i + 1] = split[i + 1].toUpperCase();
    }
    return split.join("").replace("-", "");
}

async function updateCommandsRegistry() {
    const CmdName = capitalizeWithDashes(cmdName);
    const cmdNameNoHyphen = cmdName.replace(/-/g, "");

    const commandsFile = await fs.promises.readFile(commandRegistryPath, "utf-8");

    const importLine = `import { Command${CmdName}Def } from "./impl/${crudType}/${cmdNameNoHyphen}";`;
    const importInsertPoint = commandsFile.indexOf("class Commands {");
    const withImport =
        commandsFile.slice(0, importInsertPoint) +
        importLine +
        "\n\n" +
        commandsFile.slice(importInsertPoint);

    const privateProperty = `    private _${cmdNameNoHyphen}?: Command${CmdName}Def;`;
    const lastPrivateMatch = withImport.lastIndexOf("private _");
    const endOfLastPrivate = withImport.indexOf(";", lastPrivateMatch) + 1;
    const withProperty =
        withImport.slice(0, endOfLastPrivate) + "\n" + privateProperty + withImport.slice(endOfLastPrivate);

    const getter = `
    get ${cmdNameNoHyphen}(): Command${CmdName}Def {
        return (this._${cmdNameNoHyphen} ??= new Command${CmdName}Def());
    }
`;
    const getAllIndex = withProperty.indexOf("getAll():");
    const withGetter = withProperty.slice(0, getAllIndex) + getter + "\n" + withProperty.slice(getAllIndex);

    const arrayMatch = withGetter.match(/return \[([\s\S]*?)\] as CommandDef/);
    if (arrayMatch) {
        const currentItems = arrayMatch[1].trim();
        const newArray = `return [\n            ${currentItems}\n            this.${cmdNameNoHyphen},\n        ] as CommandDef`;
        const final = withGetter.replace(/return \[[\s\S]*?\] as CommandDef/, newArray);

        await fs.promises.writeFile(commandRegistryPath, final);
        console.info(`Updated ${commandRegistryPath} successfully!`);
    }
}

void main();
