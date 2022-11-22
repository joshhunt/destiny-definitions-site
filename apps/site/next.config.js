const nextTranspileModules = require("next-transpile-modules");

// next.config.js
const withTM = nextTranspileModules([
  "@destiny-definitions/common",
  "@destiny-definitions/invariant",
]);

module.exports = withTM({});
