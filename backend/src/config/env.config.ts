import { getEnv } from "../utils/getEnv.js";

export const Env = {
  PORT: getEnv("PORT"),
} as const;