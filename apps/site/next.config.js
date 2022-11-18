import nextTranspileModules from "next-transpile-modules";

// next.config.js
const withTM = nextTranspileModules(['@destiny-definitions/common']);

export default withTM({});