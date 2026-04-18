import * as core from "@actions/core";
import * as github from "@actions/github";

import { typesRegex } from "./types";

function main(): void {
    try {
        const context = github.context;

        if (!context.payload.pull_request) {
            core.setFailed("Unexpected Error.");
            process.exit(1);
        }

        const prTitle = context.payload.pull_request.title as string;

        const match = prTitle.match(typesRegex);

        if (!match) {
            core.setFailed("Title of the PR is not correct. See CONTRIBUTING.md");
            process.exit(1);
        }

        core.info("PR title valid.");
        process.exit(0);
    } catch (err) {
        core.setFailed(`Error: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
    }
}

try {
    main();
} catch (err: unknown) {
    core.setFailed(`Error: ${err instanceof Error ? err.message : String(err)}`);
    process.exit(1);
}
