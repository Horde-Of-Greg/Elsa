import * as github from "@actions/github";
import { Octokit } from "octokit";

export async function getCommitMessage(sha: string): Promise<string> {
    const octokit = await getOctoClient();
    const context = github.context;

    const { data: commit } = await octokit.rest.repos.getCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        ref: sha,
    });

    return commit.commit.message;
}

async function getOctoClient() {
    const token = process.env.GITHUB_TOKEN;
    if (token === undefined) {
        throw new Error("GITHUB_TOKEN not found");
    }
    return new Octokit({ auth: token });
}
