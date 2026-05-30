import type { GitHubContext } from "./context.js";

export type PullRequestTask = (context: PullRequestContext) => void;

export type PullRequestContext = GitHubContext & {
    payload: GitHubContext["payload"] & {
        pull_request: NonNullable<GitHubContext["payload"]["pull_request"]>;
    };
};
