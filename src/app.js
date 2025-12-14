import express from "express";
import webhookRoutes from "./routes/webhookRoutes.js";
import { PORT } from "./config/env.js";

const app = express();
app.use(express.json());

// Rutas
app.use("/", webhookRoutes);

app.listen(PORT, () => {
  console.log(` Listening on port ${PORT}`);
});
