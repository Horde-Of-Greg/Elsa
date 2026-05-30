import * as github from "@actions/github";

import { env } from "../../env/env.js";
import type { GitHubCommitResponse, GitHubCommitSHA } from "../../types/github/commits.js";
import { assertDefined } from "../types/assertions.js";
import { makeGithubCommitSha } from "../types/constructors/github/commit.js";
import { getCommitURL, getGitHubHeaders } from "./url.js";

export async function getCommitMessage(sha: GitHubCommitSHA): Promise<string> {
    const token = env.GITHUB_TOKEN;
    assertDefined(token);

    const url = getCommitURL(sha);
    const response = await fetch(url, {
        headers: getGitHubHeaders(),
    });
    const data = (await response.json()) as GitHubCommitResponse;
    return data.commit.message;
}

export function getCommitSha(): GitHubCommitSHA {
    const sha: unknown = github.context.payload.after ?? github.context.sha;
    if (typeof sha !== "string") {
        throw new Error("Could not get commit SHA");
    }
    return makeGithubCommitSha(sha);
}
