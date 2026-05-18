import * as github from "@actions/github";

import { env } from "../env/env";
import type { GitHubCommitResponse } from "../types/github";

export async function getCommitMessage(sha: string): Promise<string> {
    const token = env.GITHUB_TOKEN;
    if (token === undefined) {
        throw new Error("Did not find the environment variable: 'GITHUB_TOKEN'");
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
        throw new Error(`Failed to fetch commit: ${JSON.stringify(response)}`);
    }

    const data = (await response.json()) as GitHubCommitResponse;
    return data.commit.message;
}
