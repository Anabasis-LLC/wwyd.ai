module.exports = {
  root: true,
  // This tells ESLint to load the config from the package
  // `@wwyd/eslint-config`.
  extends: ["@wwyd/eslint-config"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
