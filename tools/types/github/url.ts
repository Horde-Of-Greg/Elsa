import type { Brand } from "../generic.js";

export type CommitURL<Value extends string = string> = Brand<Value, "Commit-URL">;

export type GitHubAPIVersion = "2022-11-28";

export type GitHubHeadersFields = {
    "Accept": string;
    "Authorization": string;
    "X-GitHub-Api-Version": GitHubAPIVersion;
};

export type GitHubHeaders<Value extends GitHubHeadersFields = GitHubHeadersFields> = Brand<
    Value,
    "GitHub-Headers"
>;
