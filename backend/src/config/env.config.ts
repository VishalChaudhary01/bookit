import { getEnv } from "../utils/getEnv.js";

export const Env = {
  PORT: getEnv("PORT"),
  DATABASE_URL: getEnv("DATABASE_URL"),
  FRONTEND_URL: getEnv("FRONTEND_URL"),
} as const;