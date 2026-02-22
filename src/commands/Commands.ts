import type { CommandDef, CommandInstance } from "./Command.js";
import { CommandAddDef } from "./impl/create/add.js";
import { CommandAliasDef } from "./impl/create/alias.js";
import { CommandDeleteDef } from "./impl/delete/delete.js";
import { CommandHelpDef } from "./impl/read/help.js";
import { CommandOwnerDef } from "./impl/read/owner.js";
import { CommandPingDef } from "./impl/read/ping.js";
import { CommandTagDef } from "./impl/read/tag.js";
import { CommandUptimeDef } from "./impl/read/uptime.js";
import { CommandVersionDef } from "./impl/read/version.js";
import { CommandEditDef } from "./impl/update/edit.js";
import { CommandSetRankDef } from "./impl/update/setrank.js";

class Commands {
    private _add?: CommandAddDef;
    private _list?: CommandHelpDef;
    private _owner?: CommandOwnerDef;
    private _ping?: CommandPingDef;
    private _tag?: CommandTagDef;
    private _uptime?: CommandUptimeDef;
    private _edit?: CommandEditDef;
    private _setRank?: CommandSetRankDef;
    private _delete?: CommandDeleteDef;
    private _alias?: CommandAliasDef;
    private _version?: CommandVersionDef;

    get add(): CommandAddDef {
        return (this._add ??= new CommandAddDef());
    }

    get help(): CommandHelpDef {
        return (this._list ??= new CommandHelpDef());
    }

    get owner(): CommandOwnerDef {
        return (this._owner ??= new CommandOwnerDef());
    }

    get ping(): CommandPingDef {
        return (this._ping ??= new CommandPingDef());
    }

    get tag(): CommandTagDef {
        return (this._tag ??= new CommandTagDef());
    }

    get uptime(): CommandUptimeDef {
        return (this._uptime ??= new CommandUptimeDef());
    }

    get edit(): CommandEditDef {
        return (this._edit ??= new CommandEditDef());
    }

    get setRank(): CommandSetRankDef {
        return (this._setRank ??= new CommandSetRankDef());
    }

    get delete(): CommandDeleteDef {
        return (this._delete ??= new CommandDeleteDef());
    }

    get alias(): CommandAliasDef {
        return (this._alias ??= new CommandAliasDef());
    }

    get version(): CommandVersionDef {
        return (this._version ??= new CommandVersionDef());
    }

    getAll(): CommandDef<unknown, CommandInstance<unknown>>[] {
        return [
            this.add,
            this.help,
            this.owner,
            this.ping,
            this.tag,
            this.uptime,
            this.edit,
            this.setRank,
            this.delete,
            this.alias,
            this.version,
        ] as CommandDef<unknown, CommandInstance<unknown>>[];
    }
}

export const commands = new Commands();
