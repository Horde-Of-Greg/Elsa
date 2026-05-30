import * as github from "@actions/github";

import type { RepoName, RepoOwner, RepoPath } from "../../types/github/repo.js";
import { makeRepoPath } from "../types/constructors/github/repo.js";

export function getRepoOwner(): RepoOwner {
    return github.context.repo.owner as RepoOwner;
}

export function getRepoName(): RepoName {
    return github.context.repo.repo as RepoName;
}

export function getRepoPath(): RepoPath {
    const owner = getRepoOwner();
    const name = getRepoName();

    return makeRepoPath(owner, name);
}
