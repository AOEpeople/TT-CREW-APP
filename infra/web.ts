/// <reference path="../.sst/platform/config.d.ts" />

export const web = (secrets: any[]) => {
  return new sst.aws.Nextjs("TT-Nextjs", {
    link: secrets,
    domain:
      $app.stage === "production"
        ? "tt-crew.app"
        : `${$app.stage}-preview.tt-crew.app`,
  });
}; 