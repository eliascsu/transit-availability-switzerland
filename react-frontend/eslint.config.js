import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import stylistic from "@stylistic/eslint-plugin-ts";
import eslintImport from "eslint-plugin-import";
import react from "eslint-plugin-react";

import baseStyleRulesPkg from "eslint-config-airbnb-base/rules/style";
import baseES6RulesPkg from "eslint-config-airbnb-base/rules/es6";
import baseBestPracticesRulesPkg from "eslint-config-airbnb-base/rules/best-practices";

const { rules: baseStyleRules } = baseStyleRulesPkg;
const { rules: baseES6Rules } = baseES6RulesPkg;
const { rules: baseBestPracticesRules } = baseBestPracticesRulesPkg;

export default [
  {
    files: ["**/*.js", "**/*.ts", "**/*.tsx"],

    settings: {
      react: {
        version: "detect",
      },
    },

    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        warnOnUnsupportedTypeScriptVersion: false,
      },
    },

    plugins: {
      tseslint,
      stylistic,
      import: eslintImport,
      react,
    },

    rules: {
      "no-console": "off",
      "no-debugger": "warn",
      "max-len": [2, 160, 2, {"ignoreUrls": true}],
      "no-nested-ternary": "off",
      "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
      "object-curly-newline": ["error", { "multiline": true, "minProperties": 8, "consistent": true }],
      "no-underscore-dangle": ["error", { "allowAfterThis": true }],
      "no-param-reassign": ["error", { "props": false }],
      "no-async-promise-executor": "off",
      "no-var": "error",
      "prefer-const": "error",
      "comma-spacing": "error",
      "comma-style": baseStyleRules["comma-style"],
      "comma-dangle": ["error", {
        "arrays": "always-multiline",
        "objects": "always-multiline",
        "imports": "always-multiline",
        "exports": "always-multiline",
        "functions": "always-multiline"
      }],
      "space-in-parens": ["error", "never"],
      "array-bracket-spacing": ["error", "never"],
      "space-infix-ops": ["error", { "int32Hint": true }],
      "space-unary-ops": "error",
      "no-implicit-globals": "error",
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1 }],
      "no-trailing-spaces": "error",

      "lines-between-class-members": "off",
      "stylistic/lines-between-class-members": ["error", "always", { "exceptAfterOverload": true }],
      "quotes": "off",
      "stylistic/quotes": ["error", "double"],
      "object-curly-spacing": "off",
      "stylistic/object-curly-spacing": ["error", "always"],

      "indent": "off",
      "stylistic/indent": baseStyleRules["indent"],
      "func-call-spacing": "off",
      "stylistic/func-call-spacing": baseStyleRules["func-call-spacing"],
      "keyword-spacing": "off",
      "stylistic/keyword-spacing": baseStyleRules["keyword-spacing"],
      "no-array-constructor": "off",
      "tseslint/no-array-constructor": baseStyleRules["no-array-constructor"],
      "space-before-blocks": "off",
      "stylistic/space-before-blocks": baseStyleRules["space-before-blocks"],
      "semi": "off",
      "stylistic/semi": baseStyleRules["semi"],
      "space-before-function-paren": "off",
      "stylistic/space-before-function-paren": baseStyleRules["space-before-function-paren"],

      "no-useless-constructor": "off",
      "tseslint/no-useless-constructor": baseES6Rules["no-useless-constructor"],
      "no-dupe-class-members": "off",
      "tseslint/no-dupe-class-members": baseES6Rules["no-dupe-class-members"],

      "default-param-last": "off",
      "tseslint/default-param-last": baseBestPracticesRules["default-param-last"],
      "dot-notation": "off",
      "tseslint/dot-notation": baseBestPracticesRules["dot-notation"],
      "no-empty-function": "off",
      "tseslint/no-empty-function": baseBestPracticesRules["no-empty-function"],
      "no-loop-func": "off",
      "tseslint/no-loop-func": baseBestPracticesRules["no-loop-func"],
      "no-magic-numbers": "off",
      "tseslint/no-magic-numbers": baseBestPracticesRules["no-magic-numbers"],
      "no-redeclare": "off",
      "tseslint/no-redeclare": baseBestPracticesRules["no-redeclare"],
      "no-throw-literal": "off",
      "@/no-throw-literal": baseBestPracticesRules["no-throw-literal"],
      "no-unused-expressions": "off",
      "tseslint/no-unused-expressions": baseBestPracticesRules["no-unused-expressions"],
      "require-await": "off",
      "stylistic/require-await": baseBestPracticesRules["require-await"],
      "no-return-await": "off",
      "tseslint/return-await": [baseBestPracticesRules["no-return-await"], "in-try-catch"],

      "import/no-cycle": [2, { ignoreExternal: true }], // TODO: Maybe this doesn't work??
      "import/prefer-default-export": "warn",

      "no-unused-vars": "off",
      "tseslint/no-unused-vars": [ "error", { "argsIgnorePattern": "^_",  "varsIgnorePattern": "^_", "caughtErrorsIgnorePattern": "^_", "ignoreRestSiblings": true } ],
      "naming-convention": "off",
      // TODO: This is to strict: CSS Selector property names
      // "tseslint/naming-convention": ["error", {"format": ["camelCase", "PascalCase", "UPPER_CASE"], "leadingUnderscore": "allow", "selector": "default"}],
      "tseslint/naming-convention": "off",
      "no-return-await": "off",
      "tseslint/return-await": "off",

      "react/prop-types": ["error", { "skipUndeclared": true }],
    },

    ignores: [
      "node_modules/**/*",
      "dist/**/*",
      "src_old/**/*",
      "test/**/*",
      "webpackPlugins/**/*",
      ".tap/**/*",
      "eslint.config.js",
      "webpack.config.js",
    ],
  },
];
