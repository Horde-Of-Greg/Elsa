import * as github from "@actions/github";

interface GitHubCommitResponse {
    commit: {
        message: string;
    };
}

export async function getCommitMessage(sha: string): Promise<string> {
    const token = process.env.GITHUB_TOKEN;
    if (token === undefined) {
        throw new Error("GITHUB_TOKEN not found");
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
        throw new Error(`Failed to fetch commit: ${response.status} ${response.statusText}`);
    }

    const data = (await response.json()) as GitHubCommitResponse;
    return data.commit.message;
}
