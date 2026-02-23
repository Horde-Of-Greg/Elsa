import eslint from "@eslint/js";
import { defineConfig } from "eslint/config";
import nodePlugin from "eslint-plugin-n";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import sonarJs from "eslint-plugin-sonarjs";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig(
    {
        ignores: ["dist/**", "config/**", "ecosystem.config.js"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.es2021,
            },
            parserOptions: {
                project: "./tsconfig.eslint.json",
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
    {
        plugins: {
            "unused-imports": unusedImports,
            "n": nodePlugin,
            "sonarjs": sonarJs,
            "importsort": simpleImportSort,
        },
        rules: {
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-misused-promises": "error",
            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/return-await": "error",
            "@typescript-eslint/strict-boolean-expressions": "warn",
            "@typescript-eslint/switch-exhaustiveness-check": "error",
            "@typescript-eslint/consistent-type-imports": "error",
            "no-return-await": "off",
            "unused-imports/no-unused-imports": "error",
            "no-console": "error",
            "eqeqeq": ["error", "always"],
            "@typescript-eslint/no-explicit-any": "warn",
            "no-duplicate-imports": "error",
            "n/no-deprecated-api": "warn",
            "n/prefer-global/process": "warn",
            "sonarjs/no-duplicate-string": "warn",
            "sonarjs/no-identical-functions": "warn",
            "sonarjs/cognitive-complexity": ["warn", 15],
            "no-param-reassign": "warn",
            "no-implicit-coercion": "warn",
            "no-warning-comments": ["warn", { terms: ["todo", "fixme"], location: "start" }],
            "importsort/imports": "error",
            "importsort/exports": "error",
            "prefer-const": "error",
            "@typescript-eslint/prefer-readonly": "error",
            "@typescript-eslint/prefer-readonly-parameter-types": "warn",
        },
    },
);
