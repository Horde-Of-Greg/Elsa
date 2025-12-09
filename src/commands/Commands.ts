import { config } from '../config/config';
import { PermLevel } from '../db/entities/UserHost';
import { CommandDef, CommandInstance } from './Command';
import { CommandAddDef } from './create/add';
import { CommandHelpDef } from './read/help';
import { CommandTagDef } from './read/tag';
import { CommandSetRankDef } from './update/setrank';

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

    getAll(): CommandDef<CommandInstance>[] {
        return [this.add, this.help, this.tag, this.setRank];
    }
}

export const commands = new Commands();
