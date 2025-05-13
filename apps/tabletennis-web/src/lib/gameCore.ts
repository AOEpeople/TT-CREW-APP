
import { TTGameCore } from "@tt-crew/core";
import { Resource } from "sst";

const gameCoreInstance = new TTGameCore({
  url: Resource.TURSO_DATABASE_URL.value,
  authToken: Resource.TURSO_AUTH_TOKEN.value,
});

export const gameCore = gameCoreInstance


