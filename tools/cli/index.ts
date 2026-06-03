#!/usr/bin/env node

import * as core from "@actions/core";
import { Argument, Command, Option } from "commander";

import type { GitHubCommitSHA } from "../types/github/commits.js";
import type { AcceptedProject } from "../types/versioning/projects.js";
import { bumpProject } from "../versioning/bump.js";
import { lintCommit } from "../versioning/commit-lint.js";
import { createBumpCommitMessage } from "../versioning/commit-message.js";
import { acceptedBumps, acceptedProjects } from "../versioning/constants.js";
import { lintPr } from "../versioning/pr-lint.js";
import { parseChoice } from "./choices.js";

const program = new Command();
const toGithubOption = new Option("-g, --to-github", "write the output to GitHub outputs");

program
    .name("elsa-tools")
    .description("Elsa's CLI to facilitate running scripts for CI and Dev tools.")
    .version(process.version);

program
    .command("bump")
    .description("Bumps one of the valid projects' package.json according to semantic versioning.")
    .addArgument(new Argument("<project>", "A valid project to bump").choices([...acceptedProjects]))
    .addArgument(
        new Argument("<bump-type>", "A valid semantic versioning bump type").choices([...acceptedBumps]),
    )
    .addOption(toGithubOption)
    .option("-t, --to-terminal", "write the output to the Console")
    .option("-d, --dry-run", "simulate the logic without writing to any file")
    .action((project: string, bumpType: string, options) => {
        if (options.toGithub === true && options.toTerminal === true) {
            throw new Error("Options --to-github and --to-terminal cannot be used together.");
        }

        parseChoice(project, acceptedProjects);
        parseChoice(bumpType, acceptedBumps);

        const newVersion = bumpProject(project, bumpType, options.dryRun === true);

        if (options.toGithub === true) {
            core.info(`Project ${project} successfully bumped to version: ${newVersion}`);
            core.setOutput("new-version", newVersion);
        } else if (options.toTerminal === true) {
            console.log(newVersion);
        } else {
            console.log(`project bumped: ${project}, new version: ${newVersion}`);
            process.stdout.write(newVersion ?? "null");
        }
    });

program
    .command("analyzeCommit")
    .description("Analyze a commit message to trigger some actions based on its metadata.")
    .addOption(toGithubOption)
    .option("-t, --to-terminal", "write the output to the Console")
    .option("-c, --commit <sha>", "The SHA of a specific commit to analyze")
    .action(async (options) => {
        let sha: GitHubCommitSHA | undefined;
        if (options.commit !== undefined) {
            sha = options.commit as GitHubCommitSHA;
        }
        const { bumpType, scope } = await lintCommit(sha);
        if (options.toGithub === true) {
            core.info(`✅ Commit Message Valid. Bump Type: ${bumpType}, Scope: ${scope}`);
            core.setOutput("bump-type", bumpType);
            core.setOutput("scope", scope);
        } else if (options.toTerminal === true) {
            console.log(JSON.stringify({ bumpType, scope }));
        } else {
            console.log(`commit analyzed, bump: ${bumpType}, scope: ${scope}`);
            process.stdout.write(JSON.stringify({ bumpType, scope }));
        }
    });

program
    .command("lintPr")
    .description("Lint a PR's characteristics to determine its validity.")
    .action(lintPr);

program
    .command("createBumpCommitMessage")
    .description("Analyze different version bumps to build a commit message")
    .argument("<project-version...>", "A project/version pair of the format project:version.")
    .addOption(toGithubOption)
    .action((projectVersions: string[], options) => {
        const newVersions: Partial<Record<AcceptedProject, string | undefined>> = {};

        for (const projectVersion of projectVersions) {
            if (!/^[a-z]+:[a-z0-9.]*$/i.test(projectVersion)) {
                throw new Error(`Invalid argument '${projectVersion}', must be of format project:version`);
            }

            const [project, version] = projectVersion.split(":");
            if (version === "") continue;

            parseChoice(project, acceptedProjects);
            newVersions[project] = version;
        }

        const message = createBumpCommitMessage(newVersions);
        if (options.toGithub === true) {
            core.info(`✅ Built Bump Commit Message: '${message}'`);
            core.setOutput("message", message);
            return;
        }
        console.log(`Commit Message: '${message}'`);
    });

program.parse();
