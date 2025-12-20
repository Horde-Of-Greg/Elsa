import type { Message } from "discord.js";

import { InternalError } from "./InternalError";

export class NoContextError extends InternalError {
    readonly code: "COMMAND_NO_CONTEXT";

    constructor() {
        super("Failed to receive a context");
    }
}

export class NoGuildError extends InternalError {
    readonly code = "COMMAND_NO_GUILD";

    constructor() {
        super("We do not support commands in DMs. YET. Feature may come later.");
    }
}

export class NoParsingError extends InternalError {
    readonly code = "COMMAND_NO_PARSING";

    constructor(message: Message) {
        super("Command was not parsed at all.", { message });
    }
}

export class ArgNotDefinedError extends InternalError {
    readonly code = "ARG_NOT_DEFINED";

    constructor(argName: string, className: string) {
        super(
            `Tried to access the arg ${argName} on class ${className}, but ${className} does not define this arg.`,
        );
    }
}

export class NoArgsDefinedError extends InternalError {
    readonly code = "NO_ARGS_DEFINED";

    constructor(argName: string, className: string) {
        super(
            `Tried to access the arg ${argName} on class ${className}, but ${className} does not define any args.`,
        );
    }
}
