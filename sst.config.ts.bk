import { SSTConfig } from "sst";
import { Config, NextjsSite } from "sst/constructs";

export default {
  config(_input) {
    return {
      name: "aoe-tabletennis-app",
      region: "eu-central-1",
    };
  },
  stacks(app) {
    app.stack(function Site({ stack }) {
      const DATABASE = new Config.Secret(stack, "DATABASE");
      const DB_HOST = new Config.Secret(stack, "DB_HOST");
      const DB_USER = new Config.Secret(stack, "DB_USER");
      const DB_PASSWORD = new Config.Secret(stack, "DB_PASSWORD");
      const SENTRY_AUTH_TOKEN = new Config.Secret(stack, "SENTRY_AUTH_TOKEN");

      const site = new NextjsSite(stack, "site", {
        customDomain: {
          domainName:
            stack.stage === "prod"
              ? "tt-crew.app"
              : `${stack.stage}.tt-crew.app`,
          hostedZone: "tt-crew.app",
        },
        bind: [DATABASE, DB_HOST, DB_USER, DB_PASSWORD, SENTRY_AUTH_TOKEN],
        environment: {
          DATABASE: process.env.DATABASE,
          DB_HOST: process.env.DB_HOST,
          DB_USER: process.env.DB_USER,
          DB_PASSWORD: process.env.DB_PASSWORD,
          SENTRY_AUTH_TOKEN: process.env.SENTRY_AUTH_TOKEN,
        },
      });

      stack.addOutputs({
        SiteUrl: site.url,
      });
    });
  },
} satisfies SSTConfig;
