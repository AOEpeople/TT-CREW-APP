/// <reference path="../.sst/platform/config.d.ts" />

export const web = (secrets: unknown[]) => {
  return new sst.aws.Nextjs("TT-Nextjs", {
    link: secrets,
    path: "apps/tabletennis-web",
    domain:
      $app.stage === "production"
        ? "tt-crew.app"
        : `${$app.stage}-preview.tt-crew.app`,
  });
}; 