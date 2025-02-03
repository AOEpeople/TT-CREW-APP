import { Resource } from "sst";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "turso",
  schema: "./src/db/schema.ts",
  out: "./drizzle",

  dbCredentials: {
    url: Resource["TURSO_DATABASE_URL"].value,
    authToken: Resource["TURSO_AUTH_TOKEN"].value,
  },
});
