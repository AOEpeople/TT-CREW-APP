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
    // Import infrastructure files
    const { secrets } = await import("./infra/secrets");
    const { web } = await import("./infra/web");

    // Create web app with secrets
    const webApp = web(Object.values(secrets));

    return {
      webAppUrl: webApp.url,
    };
  },
});
