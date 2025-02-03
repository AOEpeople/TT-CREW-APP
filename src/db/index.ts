import { drizzle } from "drizzle-orm/libsql";

import { createClient } from "@libsql/client";

import * as schema from "@/db/schema";
import { Resource } from "sst";

const client = createClient({
  url: Resource["TURSO_DATABASE_URL"].value,
  authToken: Resource["TURSO_AUTH_TOKEN"].value,
});

export const db = drizzle({
  schema,
  client,
});
