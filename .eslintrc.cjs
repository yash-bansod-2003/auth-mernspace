/** @type {import("eslint").Linter.Config} */

const { resolve } = require("node:path");

const project = resolve(process.cwd(), "tsconfig.json");

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "prettier",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    tsconfigRootDir: __dirname,
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
  ignorePatterns: [
    "node_modules/",
    "dist/",
    ".eslintrc.*",
    "jest.config.*",
    "/scripts/*",
    "tsup.config.*",
  ],
  rules: {
    "no-console": "error",
    "import/no-default-export": "off",
    "@typescript-eslint/no-misused-promises": "off",
    "@typescript-eslint/unbound-method": "off",
    "@typescript-eslint/no-unsafe-return": "off",
  },
};
