import type { Brand } from "../generic.js";

export type RepoOwner<Value extends string = string> = Brand<Value, "RepoOwner">;
export type RepoName<Value extends string = string> = Brand<Value, "RepoName">;

export type RepoPath<Owner extends RepoOwner = RepoOwner, Name extends RepoName = RepoName> = Brand<
    `${Owner}/${Name}`,
    "RepoPath"
> & {
    readonly owner: Owner;
    readonly name: Name;
};
