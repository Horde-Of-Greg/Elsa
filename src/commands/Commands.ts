import type { CommandDef, CommandInstance } from "./Command";
import { CommandAddDef } from "./impl/create/add";
import { CommandAliasDef } from "./impl/create/alias";
import { CommandDeleteDef } from "./impl/delete/delete";
import { CommandHelpDef } from "./impl/read/help";
import { CommandOwnerDef } from "./impl/read/owner";
import { CommandPingDef } from "./impl/read/ping";
import { CommandTagDef } from "./impl/read/tag";
import { CommandUptimeDef } from "./impl/read/uptime";
import { CommandVersionDef } from "./impl/read/version";
import { CommandEditDef } from "./impl/update/edit";
import { CommandSetRankDef } from "./impl/update/setrank";

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
