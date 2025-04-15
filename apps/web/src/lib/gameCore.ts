import "server-only";

import { TTGameCore } from "@tt-crew/core";
import { Resource } from "sst";

// Since this is a server-only module, we can safely initialize it here
export const gameCore = new TTGameCore({
  url: Resource["TURSO_DATABASE_URL"].value,
  authToken: Resource["TURSO_AUTH_TOKEN"].value,
}); 