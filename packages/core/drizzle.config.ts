import type { Config } from "drizzle-kit";
import { Resource } from "sst";
export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: Resource.TURSO_DATABASE_URL.value ,
    authToken: Resource.TURSO_AUTH_TOKEN.value,
  },
} satisfies Config; 