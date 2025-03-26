module.exports = {
  apps: [
    {
      name: "client",
      script: "npm",
      args: "run dev",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
      },
    },
  ],
};
