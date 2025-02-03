import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import pluginNext from "@next/eslint-plugin-next";
import pluginReactHooks from "eslint-plugin-react-hooks";
import pluginJsxA11y from "eslint-plugin-jsx-a11y";
import pluginSonarJS from "eslint-plugin-sonarjs";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  {
    ignores: [
      "node_modules",
      ".next",
      "drizzle",
      ".next",
      ".open-next",
      ".sst",
    ],
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginReact.configs.flat["jsx-runtime"],
  pluginJsxA11y.flatConfigs.recommended,
  pluginSonarJS.configs.recommended,
  {
    plugins: {
      "@next/next": pluginNext,
    },
  },
  {
    plugins: {
      pluginSonarJS,
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: pluginReactHooks.configs.recommended.rules,
  },
];
