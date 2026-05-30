import { env } from "../../env/env.js";
import type { GitHubCommitSHA } from "../../types/github/commits.js";
import type { CommitURL, GitHubHeaders } from "../../types/github/url.js";
import { makeGitHubHeaders } from "../types/constructors/github/url.js";
import { getRepoPath } from "./repo.js";

export function getCommitURL(sha: GitHubCommitSHA): CommitURL {
    return `https://api.github.com/repos/${getRepoPath()}/commits/${sha}` as CommitURL;
}

export function getGitHubHeaders(): GitHubHeaders {
    return makeGitHubHeaders({
        "Accept": "application/vnd.github+json",
        "Authorization": `Bearer ${env.GITHUB_TOKEN}`,
        "X-GitHub-Api-Version": "2022-11-28",
    });
}
