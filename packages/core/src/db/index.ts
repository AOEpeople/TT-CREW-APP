import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

export interface DatabaseConfig {
  url: string;
  authToken: string;
}

export function createDatabase(config: DatabaseConfig) {
  const client = createClient({
    url: config.url,
    authToken: config.authToken,
  });

  return drizzle(client, { schema });
}

export { schema }; 