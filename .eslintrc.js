// .eslintrc.js
module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
      ecmaVersion: 2020,
      sourceType: "module",
    },
    plugins: ["prettier", "unused-imports"], // use plugin
    extends: [
      "plugin:prettier/recommended", // we use the recommended set
    ],
    rules: {
      "prettier/prettier": "warn", // styling warning based on prettier
      "prefer-const": "warn", // const type is preferred
      "unused-imports/no-unused-imports": "warn",
      "unused-imports/no-unused-vars": "warn",
    },
    ignorePatterns: ["generated*"],
  };
  