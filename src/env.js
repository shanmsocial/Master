import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    SUPABASE_PROJECT_URL: z.string().url(),
    SUPABASE_KEY: z.string(),
    SUPABASE_DATABASE_URL: z.string().url(),
    API_KEY: z.string().min(1),
    EMAIL_HOST: z.string().min(1),
    EMAIL_PORT: z.string().min(1),
    EMAIL_SECURE: z.string().min(1),
    EMAIL_USER: z.string().min(1),
    EMAIL_PASSWORD: z.string().min(1),
    EMAIL_FROM: z.string().min(1),
    EMAIL_TO: z.string().min(1),
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string(),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_PROJECT_URL: process.env.SUPABASE_PROJECT_URL,
    SUPABASE_KEY: process.env.SUPABASE_KEY,
    SUPABASE_DATABASE_URL: process.env.SUPABASE_DATABASE_URL,
    API_KEY: process.env.API_KEY,
    EMAIL_HOST: process.env.EMAIL_HOST,
    EMAIL_PORT: process.env.EMAIL_PORT,
    EMAIL_SECURE: process.env.EMAIL_SECURE,
    EMAIL_USER: process.env.EMAIL_USER,
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_FROM: process.env.EMAIL_FROM,
    EMAIL_TO: process.env.EMAIL_TO,
    // NEXT_PUBLIC_CLIENTVAR: process.env.NEXT_PUBLIC_CLIENTVAR,
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true,
});
