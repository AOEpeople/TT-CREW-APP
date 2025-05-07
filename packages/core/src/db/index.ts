import { drizzle, LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client/web";
import * as schema from "./schema";

export interface DatabaseConfig {
  url: string;
  authToken?: string;
}

export function createDatabase(config: DatabaseConfig): LibSQLDatabase<typeof schema> {
  const client = createClient({
    url: config.url,
    authToken: config.authToken,
  });

  return drizzle(client, { schema });
}

export { schema }; 