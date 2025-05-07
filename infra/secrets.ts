/// <reference path="../.sst/platform/config.d.ts" />


export const secrets = {
  TURSO_DATABASE_URL: new sst.Secret("TURSO_DATABASE_URL"),
  TURSO_AUTH_TOKEN: new sst.Secret("TURSO_AUTH_TOKEN"),
}; 