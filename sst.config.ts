/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "tt-crew-app",
      removal: input?.stage === "production" ? "retain" : "remove",
      protect: ["production"].includes(input?.stage),
      home: "aws",
    };
  },
  async run() {
    const SENTRY_AUTH_TOKEN = new sst.Secret("SENTRY_AUTH_TOKEN");
    const TURSO_DATABASE_URL = new sst.Secret("TURSO_DATABASE_URL");
    const TURSO_AUTH_TOKEN = new sst.Secret("TURSO_AUTH_TOKEN");

    new sst.aws.Nextjs("TT-Nextjs", {
      link: [SENTRY_AUTH_TOKEN, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN],
      domain:
        $app.stage === "production"
          ? "tt-crew.app"
          : `${$app.stage}-preview.tt-crew.app`,
    });
  },
});
