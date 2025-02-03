import { z } from "zod";

const envVariables = z.object({
  SENTRY_AUTH_TOKEN: z.string(),
  TURSO_DATABASE_URL: z.string().url(),
  TURSO_AUTH_TOKEN: z.string(),
});

const env = envVariables.parse(process.env);
export default env;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envVariables> {}
  }
}
