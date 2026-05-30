import type { GitHubCommitSHA } from "../../../../types/github/commits.js";

export function makeGithubCommitSha<Value extends string>(commitSha: Value): GitHubCommitSHA<Value> {
    return commitSha as GitHubCommitSHA<Value>;
}
