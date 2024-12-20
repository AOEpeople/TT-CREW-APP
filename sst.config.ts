/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "aoe-tabletennis-app",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws"
    };
  },
  async run() {
/**  const DATABASE = new Config.Secret(stack, "DATABASE");
      const DB_HOST = new Config.Secret(stack, "DB_HOST");
      const DB_USER = new Config.Secret(stack, "DB_USER");
      const DB_PASSWORD = new Config.Secret(stack, "DB_PASSWORD");
      const SENTRY_AUTH_TOKEN = new Config.Secret(stack, "SENTRY_AUTH_TOKEN");*/
    const DATABASE = new sst.Secret("DATABASE");
    const DB_HOST = new sst.Secret("DB_HOST");
    const DB_USER = new sst.Secret("DB_USER");
    const DB_PASSWORD = new sst.Secret("DB_PASSWORD");
    const SENTRY_AUTH_TOKEN = new sst.Secret("SENTRY_AUTH_TOKEN");

    new sst.aws.Nextjs("MyWeb", {
      link: [DATABASE, DB_HOST, DB_USER, DB_PASSWORD, SENTRY_AUTH_TOKEN],
    });
  },
});
