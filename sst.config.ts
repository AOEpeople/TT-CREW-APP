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

    const vpc = new sst.aws.Vpc("TT-VPC", {
      bastion: true,
      nat: "ec2",
    });
    const database = new sst.aws.Postgres("TT-Database", {
      vpc,
      proxy: true,
      dev: {
        username: "postgres",
        password: "password",
        database: "postgres",
        host: "localhost",
        port: 5432,
      },
    });

    new sst.x.DevCommand("Studio", {
      link: [database],
      dev: {
        command: "pnpm drizzle-kit studio",
      },
    });

    new sst.aws.Nextjs("TT-Nextjs", {
      link: [SENTRY_AUTH_TOKEN, database],
      vpc,
      domain:
        $app.stage === "production"
          ? "tt-crew.app"
          : `${$app.stage}-preview.tt-crew.app`,
    });
  },
});
