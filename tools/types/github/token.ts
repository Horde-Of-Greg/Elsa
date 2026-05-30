import type { Brand } from "../generic.js";

export type GitHubToken<Value extends string = string> = Brand<Value, "GitHub-Token">;
