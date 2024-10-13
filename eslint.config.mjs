import eslintPluginImportX from "eslint-plugin-import-x";
import eslintPluginJs from "@eslint/js";
import eslintPluginStylistic from "@stylistic/eslint-plugin";
import globals from "globals";

const config = [
  eslintPluginJs.configs.all,
  eslintPluginImportX.flatConfigs.recommended,
  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.browser,
        ...globals.node,
        config: "readonly"
      },
      sourceType: "commonjs"
    },
    plugins: {
      ...eslintPluginStylistic.configs["all-flat"].plugins
    },
    rules: {
      ...eslintPluginStylistic.configs["all-flat"].rules,
      "@stylistic/array-element-newline": ["error", "consistent"],
      "@stylistic/dot-location": ["error", "property"],
      "@stylistic/function-call-argument-newline": ["error", "consistent"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/quote-props": ["error", "as-needed"],
      "capitalized-comments": "off",
      "consistent-this": "off",
      "max-statements": ["error", 25],
      "multiline-comment-style": "off",
      "no-magic-numbers": "off",
      "no-ternary": "off",
      "one-var": "off",
      "sort-keys": "off",
      strict: "off"
    }
  },
  {
    files: ["**/*.mjs"],
    languageOptions: {
      ecmaVersion: "latest",
      globals: {
        ...globals.node
      },
      sourceType: "module"
    },
    plugins: {
      ...eslintPluginStylistic.configs["all-flat"].plugins
    },
    rules: {
      ...eslintPluginStylistic.configs["all-flat"].rules,
      "@stylistic/array-element-newline": "off",
      "@stylistic/dot-location": ["error", "property"],
      "@stylistic/function-call-argument-newline": ["error", "consistent"],
      "@stylistic/function-paren-newline": "off",
      "@stylistic/indent": ["error", 2],
      "@stylistic/padded-blocks": ["error", "never"],
      "@stylistic/quote-props": ["error", "as-needed"],
      "func-style": "off",
      "max-lines-per-function": ["error", 100],
      "no-magic-numbers": "off",
      "no-undefined": "off",
      "one-var": "off",
      "prefer-destructuring": "off"
    }
  }
];

export default config;
