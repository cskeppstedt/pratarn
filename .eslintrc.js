module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  extends: ["airbnb-typescript/base"],
  rules: {
    "no-console": "off",
    "import/prefer-default-export": "off",
    "max-len": "off"
  },
  ignorePatterns: ["build/", "node_modules/"]
};
