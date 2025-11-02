import express, { type Request, type Response } from "express";
import cors from "cors";
import { Env } from "./config/env.config.js";
import connectDatabase from "./config/db.config.js";
import appRoutes from "./routes/index.js";

const app = express();
const PORT = Env.PORT;

app.use(cors({ origin: Env.FRONTEND_URL }));
app.use(express.json());

app.get("/health", async (_req: Request, res: Response) => {
  res.status(200).json({ message: "Healthy server" });
});

app.use("/api/v1", appRoutes);

app.listen(PORT, async () => {
  console.log(`Server runnung at http://localhost:${PORT}`);
  await connectDatabase();
});
