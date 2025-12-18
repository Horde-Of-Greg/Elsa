import type { CommandDef, CommandInstance } from "./Command";
import { CommandAddDef } from "./impl/create/add";
import { CommandHelpDef } from "./impl/read/help";
import { CommandTagDef } from "./impl/read/tag";
import { CommandSetRankDef } from "./impl/update/setrank";

class Commands {
    // Create
    private _add?: CommandAddDef;

    // Delete

    // Read
    private _list?: CommandHelpDef;
    private _tag?: CommandTagDef;

    // Update
    private _setRank?: CommandSetRankDef;

    get add(): CommandAddDef {
        return (this._add ??= new CommandAddDef());
    }

    get help(): CommandHelpDef {
        return (this._list ??= new CommandHelpDef());
    }

    get tag(): CommandTagDef {
        return (this._tag ??= new CommandTagDef());
    }

    get setRank(): CommandSetRankDef {
        return (this._setRank ??= new CommandSetRankDef());
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    getAll(): CommandDef<any, CommandInstance<any>>[] {
        return [this.add, this.help, this.tag, this.setRank];
    }
}

export const commands = new Commands();
