import cors from "cors";
import express from "express";

import { routes } from "./routes";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", routes);

const PORT = 3333;

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`);
});