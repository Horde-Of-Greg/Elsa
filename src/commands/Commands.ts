import type { CommandDef, CommandInstance } from "./Command";
import { CommandAddDef } from "./impl/create/add";
import { CommandHelpDef } from "./impl/read/help";
import { CommandTagDef } from "./impl/read/tag";
import { CommandEditDef } from "./impl/update/edit";
import { CommandSetRankDef } from "./impl/update/setrank";

class Commands {
    // Create
    private _add?: CommandAddDef;

    // Delete

    // Read
    private _list?: CommandHelpDef;
    private _tag?: CommandTagDef;

    // Update
    private _edit?: CommandEditDef;
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

    get edit(): CommandEditDef {
        return (this._edit ??= new CommandEditDef());
    }

    get setRank(): CommandSetRankDef {
        return (this._setRank ??= new CommandSetRankDef());
    }

    getAll(): CommandDef<unknown, CommandInstance<unknown>>[] {
        return [this.add, this.help, this.tag, this.edit, this.setRank] as CommandDef<
            unknown,
            CommandInstance<unknown>
        >[];
    }
}

export const commands = new Commands();
