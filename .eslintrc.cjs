/** @type {import("eslint").Linter.Config} */

const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    require.resolve("@vercel/style-guide/eslint/node"),
    require.resolve("@vercel/style-guide/eslint/typescript"),
    require.resolve("@vercel/style-guide/eslint/jest"),
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-type-checked',
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
  },
  env: {
    node: true,
    es6: true,
  },
  settings: {
    "import/resolver": {
      typescript: {
        project,
      },
    },
  },
  overrides: [
    {
      files: ["**/__tests__/**/*"],
      env: {
        jest: true,
      },
    },
  ],
  ignorePatterns: ["node_modules/", "dist/", ".eslintrc.*"],
  rules: {
    "import/no-default-export": "off",
  },
};
