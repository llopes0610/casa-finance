import cors from "cors";
import express from "express";

import { routes } from "./routes";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean) as string[];

app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

app.use("/api", routes);

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`API running on port ${PORT}`);
});