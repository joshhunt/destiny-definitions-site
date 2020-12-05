// PM2 config file

module.exports = {
  apps: [
    {
      name: "app",
      script: "yarn",
      args: "start",
      interpreter: "none",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
