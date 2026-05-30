import type { Brand } from "../generic.js";

export type GitHubCommitResponse = {
    commit: {
        message: string;
    };
};

export type GitHubCommitSHA<Value extends string = string> = Brand<Value, "Commit-SHA">;
