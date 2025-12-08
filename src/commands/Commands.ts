import { config } from '../config/config';
import { PermLevel } from '../db/entities/UserHost';
import { CommandDef, CommandInstance } from './Command';
import { CommandAddDef } from './create/add';
import { CommandListDef } from './read/list';
import { CommandTagDef } from './read/tag';
import { CommandSetRankDef } from './update/setrank';

class Commands {
    // Create
    private _add?: CommandAddDef;

    // Delete

    // Read
    private _list?: CommandListDef;
    private _tag?: CommandTagDef;

    // Update
    private _setRank?: CommandSetRankDef;

    get add(): CommandAddDef {
        return (this._add ??= new CommandAddDef());
    }

    get list(): CommandListDef {
        return (this._list ??= new CommandListDef());
    }

    get tag(): CommandTagDef {
        return (this._tag ??= new CommandTagDef());
    }

    get setRank(): CommandSetRankDef {
        return (this._setRank ??= new CommandSetRankDef());
    }

    getAll(): CommandDef<CommandInstance>[] {
        return [this.add, this.list, this.tag, this.setRank];
    }
}

export const commands = new Commands();
