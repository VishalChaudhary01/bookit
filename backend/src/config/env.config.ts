import { getEnv } from "../utils/getEnv.js";

export const Env = {
  PORT: getEnv("PORT"),
  DATABASE_URL: getEnv("DATABASE_URL")
} as const;