const nextTranspileModules = require("next-transpile-modules");

// next.config.js
const withTM = nextTranspileModules([
  "@destiny-definitions/common",
  "@destiny-definitions/invariant",
]);

module.exports = withTM({
  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true,
  },
  experimental: {
    isrMemoryCacheSize: 0,
  },
});
