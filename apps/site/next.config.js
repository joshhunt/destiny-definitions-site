// import nextTranspileModules from "next-transpile-modules";
const nextTranspileModules = require("next-transpile-modules");

// next.config.js
const withTM = nextTranspileModules(["@destiny-definitions/common"]);

// export default withTM({});
module.exports = withTM({});
