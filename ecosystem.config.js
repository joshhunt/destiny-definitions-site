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
  deploy: {
    // "production" is the environment name
    production: {
      user: "josh",
      host: ["165.232.110.210"],
      ref: "origin/master",
      repo: "git@github.com:joshhunt/destiny-definitions-site.git",
      path: "/home/josh/destiny-definitions-site",
      "post-deploy":
        "yarn install; yarn build; yarn run pm2 startOrRestart ecosystem.config.js app",
    },
  },
};
