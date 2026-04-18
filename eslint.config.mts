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
            "default-param-last": "error",
            "dot-notation": "error",
            "eqeqeq": ["error", "always"],
            "no-console": "error",
            "no-duplicate-imports": "error",
            "no-loss-of-precision": "error",
            "prefer-const": "error",

            "no-param-reassign": "warn",
            "no-implicit-coercion": "warn",
            "no-warning-comments": ["warn", { terms: ["todo", "fixme"], location: "start" }],

            "no-unused-vars": "off",
            "no-return-await": "off",
            "no-implied-eval": "off",
            "no-loop-func": "off",
            "no-magic-numbers": "off",
            "no-unused-private-class-members": "off",
            "no-throw-literal": "off",
            "require-await": "off",

            "@typescript-eslint/await-thenable": "error",
            "@typescript-eslint/consistent-type-imports": "error",
            "@typescript-eslint/explicit-function-return-type": "error",
            "@typescript-eslint/no-base-to-string": "error",
            "@typescript-eslint/no-confusing-non-null-assertion": "error",
            "@typescript-eslint/no-confusing-void-expression": "error",
            "@typescript-eslint/no-duplicate-enum-values": "error",
            "@typescript-eslint/no-duplicate-type-constituents": "error",
            "@typescript-eslint/no-empty-object-type": "error",
            "@typescript-eslint/no-extra-non-null-assertion": "error",
            "@typescript-eslint/no-floating-promises": "error",
            "@typescript-eslint/no-for-in-array": "error",
            "@typescript-eslint/no-implied-eval": "error",
            "@typescript-eslint/no-inferrable-types": "error",
            "@typescript-eslint/no-invalid-void-type": "error",
            "@typescript-eslint/no-loop-func": "error",
            "@typescript-eslint/no-misused-promises": "error",
            "@typescript-eslint/no-meaningless-void-operator": "error",
            "@typescript-eslint/no-misused-spread": "error",
            "@typescript-eslint/no-mixed-enums": "error",
            "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",
            "@typescript-eslint/no-non-null-assertion": "error",
            "@typescript-eslint/no-unnecessary-condition": "error",
            "@typescript-eslint/no-unnecessary-type-arguments": "error",
            "@typescript-eslint/no-unnecessary-type-assertion": "error",
            "@typescript-eslint/no-unnecessary-type-constraint": "error",
            "@typescript-eslint/no-unnecessary-type-conversion": "error",
            "@typescript-eslint/no-unnecessary-type-parameters": "error",
            "@typescript-eslint/no-unsafe-argument": "error",
            "@typescript-eslint/no-unsafe-assignment": "error",
            "@typescript-eslint/no-unsafe-declaration-merging": "error",
            "@typescript-eslint/no-unsafe-enum-comparison": "error",
            "@typescript-eslint/no-unsafe-function-type": "error",
            "@typescript-eslint/no-unsafe-unary-minus": "error",
            "@typescript-eslint/no-unused-private-class-members": "error",
            "@typescript-eslint/no-wrapper-object-types": "error",
            "@typescript-eslint/non-nullable-type-assertion-style": "error",
            "@typescript-eslint/only-throw-error": "error",
            "@typescript-eslint/prefer-enum-initializers": "error",
            "@typescript-eslint/prefer-find": "error",
            "@typescript-eslint/prefer-for-of": "error",
            "@typescript-eslint/prefer-includes": "error",
            "@typescript-eslint/prefer-literal-enum-member": "error",
            "@typescript-eslint/prefer-nullish-coalescing": "error",
            "@typescript-eslint/prefer-readonly": "error",
            "@typescript-eslint/prefer-regexp-exec": "error",
            "@typescript-eslint/prefer-return-this-type": "error",
            "@typescript-eslint/prefer-string-starts-ends-with": "error",
            "@typescript-eslint/promise-function-async": "error",
            "@typescript-eslint/related-getter-setter-pairs": "error",
            "@typescript-eslint/require-array-sort-compare": "error",
            "@typescript-eslint/return-await": "error",
            "@typescript-eslint/switch-exhaustiveness-check": "error",
            "@typescript-eslint/strict-boolean-expressions": "error",
            "@typescript-eslint/strict-void-return": "error",
            "@typescript-eslint/use-unknown-in-catch-callback-variable": "error",

            "@typescript-eslint/no-unused-vars": "off",

            "importsort/imports": "error",
            "importsort/exports": "error",

            "n/no-deprecated-api": "warn",
            "n/prefer-global/process": "warn",

            "sonarjs/no-duplicate-string": "warn",
            "sonarjs/no-identical-functions": "warn",
            "sonarjs/cognitive-complexity": ["warn", 15],

            "unused-imports/no-unused-imports": "error",
        },
    },
);
