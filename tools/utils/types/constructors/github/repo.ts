import type { RepoName, RepoOwner, RepoPath } from "../../../../types/github/repo.js";

export function makeRepoOwner<const Value extends string>(owner: Value): RepoOwner<Value> {
    return owner as RepoOwner<Value>;
}

export function makeRepoName<const Value extends string>(name: Value): RepoName<Value> {
    return name as RepoName<Value>;
}

export function makeRepoPath<const Owner extends RepoOwner, const Name extends RepoName>(
    owner: Owner,
    name: Name,
): RepoPath<Owner, Name> {
    return `${owner}/${name}` as RepoPath<Owner, Name>;
}
