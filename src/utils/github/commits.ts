import * as github from "@actions/github";

import { EnvVariableNotFound } from "../../errors/internal/config";
import { FailedToFetchError } from "../../errors/internal/http";
import type { GitHubCommitResponse } from "../../types/github/commit";

export async function getCommitMessage(sha: string): Promise<string> {
    const token = process.env.GITHUB_TOKEN;
    if (token === undefined) {
        throw new EnvVariableNotFound("GITHUB_TOKEN");
    }

    const context = github.context;
    const url = `https://api.github.com/repos/${context.repo.owner}/${context.repo.repo}/commits/${sha}`;

    const response = await fetch(url, {
        headers: {
            "Accept": "application/vnd.github+json",
            "Authorization": `Bearer ${token}`,
            "X-GitHub-Api-Version": "2022-11-28",
        },
    });

    if (!response.ok) {
        throw new FailedToFetchError(response, "Failed to fetch commit.");
    }

    const data = (await response.json()) as GitHubCommitResponse;
    return data.commit.message;
}
