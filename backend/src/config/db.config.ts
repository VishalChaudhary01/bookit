import mongoose from "mongoose";
import { Env } from "./env.config.js";

async function connectDatabase() {
  try {
    await mongoose.connect(Env.DATABASE_URL);
    console.log('Database connected');
  } catch (err) {
    console.error('Database not reachable:', err);
    process.exit(1);
  }
}

export default connectDatabase;