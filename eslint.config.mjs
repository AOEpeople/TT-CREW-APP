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
    rules: {
      "sonarjs/todo-tag": "warn",
    },
  },
  {
    name: "should-get-fixed-later",
    rules: {
      "jsx-a11y/click-events-have-key-events": "warn",
      "jsx-a11y/no-static-element-interactions": "warn",
      "@typescript-eslint/no-namespace": "warn",
      "@typescript-eslint/no-require-imports": "warn",
      "@typescript-eslint/no-empty-object-type": "warn",
      "sonarjs/no-nested-conditional": "warn",
      "sonarjs/no-nested-template-literals": "warn",
      "react/prop-types": "warn",
      "sonarjs/table-header": "warn",
    },
  },
  {
    name: "sst-overrides",
    files: ["sst.config.ts"],
    rules: {
      "sonarjs/constructor-for-side-effects": "off",
      "@typescript-eslint/triple-slash-reference": "off",
    },
  },
  {
    plugins: {
      "react-hooks": pluginReactHooks,
    },
    rules: pluginReactHooks.configs.recommended.rules,
  },
];
