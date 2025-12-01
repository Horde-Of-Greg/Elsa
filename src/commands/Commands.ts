import { PermLevel } from '../db/entities/UserHost';
import { BaseCommand } from './BaseCommand';
import { CommandAdd } from './create/add';
import { CommandList } from './read/list';
import { CommandTag } from './read/tag';
import { CommandSetRank } from './update/setrank';

class Commands {
    // Create
    private _add?: CommandAdd;

    // Delete

    // Read
    private _list?: CommandList;
    private _tag?: CommandTag;

    // Update
    private _setRank?: CommandSetRank;

    get add(): CommandAdd {
        return (this._add ??= new CommandAdd({
            name: 'add',
            aliases: ['a'],
            permLevelRequired: PermLevel.TRUSTED,
            cooldown: 5,
        }));
    }

    get list(): CommandList {
        return (this._list ??= new CommandList({
            name: 'list',
            aliases: ['l', 'li'],
            permLevelRequired: PermLevel.DEFAULT,
            cooldown: -1,
        }));
    }

    get tag(): CommandTag {
        return (this._tag ??= new CommandTag({
            name: 'tag',
            aliases: ['t'],
            permLevelRequired: PermLevel.DEFAULT,
            cooldown: -1,
        }));
    }

    get setRank(): CommandSetRank {
        return (this._setRank ??= new CommandSetRank({
            name: 'setrank',
            aliases: ['sr', 'srank'],
            permLevelRequired: PermLevel.OWNER,
            cooldown: -1,
        }));
    }

    getAll(): BaseCommand[] {
        return [this.add, this.list, this.tag, this.setRank];
    }
}

export const commands = new Commands();
