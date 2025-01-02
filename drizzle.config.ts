import { Resource } from "sst";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",

  dbCredentials: {
    ssl:
      Resource.App.stage === "production"
        ? { rejectUnauthorized: false }
        : false,
    database: Resource["TT-Database"].database,
    host: Resource["TT-Database"].host,
    password: Resource["TT-Database"].password,
    user: Resource["TT-Database"].username,
    port: Resource["TT-Database"].port,
  },
});
