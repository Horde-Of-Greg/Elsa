import { config } from '../config/config';
import { PermLevel } from '../db/entities/UserHost';
import { CommandDef } from './Command';
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
        return (this._add ??= new CommandAddDef({
            name: 'add',
            aliases: ['a'],
            permLevelRequired: PermLevel.TRUSTED,
            cooldown_s: 5,
        }));
    }

    get list(): CommandListDef {
        return (this._list ??= new CommandListDef({
            name: 'list',
            aliases: ['l', 'li'],
            permLevelRequired: PermLevel.DEFAULT,
            cooldown_s: -1,
        }));
    }

    get tag(): CommandTagDef {
        return (this._tag ??= new CommandTagDef({
            name: 'tag',
            aliases: ['t'],
            permLevelRequired: PermLevel.DEFAULT,
            cooldown_s: -1,
        }));
    }

    get setRank(): CommandSetRankDef {
        return (this._setRank ??= new CommandSetRankDef({
            name: 'setrank',
            aliases: ['sr', 'srank'],
            permLevelRequired: PermLevel.OWNER,
            cooldown_s: -1,
        }));
    }

    getAll(): CommandDef[] {
        return [this.add, this.list, this.tag, this.setRank];
    }
}

export const commands = new Commands();
