
import { drizzle } from "drizzle-orm/node-postgres";

import * as schema from "@/db/schema";
import { Resource } from "sst";


export const db = drizzle({
  schema,
  connection: {
    user: Resource["TT-Database"].username,
    password: Resource["TT-Database"].password,
    host: Resource["TT-Database"].host,
    port: Resource["TT-Database"].port,
    database: Resource["TT-Database"].database,
  }
});

