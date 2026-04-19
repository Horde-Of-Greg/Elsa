import type { TagTable } from "../db/entities/Tag";
import { NotOwnerError } from "../errors/client/403";
import { TagNotFoundError } from "../errors/client/404";
import { CommandInstance } from "./Command";
import { commands } from "./Commands";

export abstract class TagHandlingCommandInstance<T = unknown> extends CommandInstance<T> {
    protected tagName: string;
    protected tag: TagTable;

    protected async ensureTagNameExists(): Promise<void> {
        const tag = await this.tagService.findTagStrict(this.tagName);
        if (!tag) {
            throw new TagNotFoundError(this.tagName, true);
        }
        this.tag = tag;
    }

    protected async ensureOwner(): Promise<void> {
        const user = await this.userService.findOrCreateUser(this.context.author);
        if (this.tag.author.discordId !== this.context.author.id) {
            throw new NotOwnerError(this.tag.author, user, this.tag);
        }
    }

    protected async invalidateCache(): Promise<void> {
        await commands.tag.invalidateCache();
    }
}
