module.exports = {
  // Restore file/directory cached in previous builds.
  // Does not do anything if:
  //  - the file/directory already exists locally
  //  - the file/directory has not been cached yet
  async onPreBuild({ utils }) {
    const result = await utils.cache.restore("./.api-cache/shared");
    console.log("onPreBuild utils.cache.restore result", result);

    const files = await utils.cache.list();
    console.log("onPreBuild Cached files", files);
  },

  // Cache file/directory for future builds.
  // Does not do anything if:
  //  - the file/directory does not exist locally
  async onPostBuild({ utils }) {
    const result = await utils.cache.save("./.api-cache/shared");

    console.log("onPostBuild utils.cache.save result", result);
  },
};
