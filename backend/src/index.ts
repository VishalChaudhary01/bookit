import express, { type Request, type Response } from "express";
import { Env } from "./config/env.config.js";

const app = express();
const PORT = Env.PORT;

app.use(express.json());

app.get("/health", async (_req: Request, res: Response) => {
  res.status(200).json({ message: "Healthy server" });
});

app.listen(PORT, async () => {
  console.log(`Server runnung at http://localhost:${PORT}`);
});