import type { GitHubCommitSHA } from "../../types/github/commits.js";
import type { GitHubToken } from "../../types/github/token.js";
import type { CommitURL, GitHubHeaders } from "../../types/github/url.js";
import { makeGitHubHeaders } from "../types/constructors/github/url.js";
import { getRepoPath } from "./repo.js";

export function getCommitURL(sha: GitHubCommitSHA): CommitURL {
    return `https://api.github.com/repos/${getRepoPath()}/commits/${sha}` as CommitURL;
}

export function getGitHubHeaders(token: GitHubToken): GitHubHeaders {
    return makeGitHubHeaders({
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${token}`,
        "X-GitHub-Api-Version": "2022-11-28",
    });
}
