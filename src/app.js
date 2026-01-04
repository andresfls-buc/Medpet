import express from "express";
import webhookRoutes from "./routes/webhookRoutes.js";

const app = express(); // 🔴 PRIMERO crear app

app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// Rutas
app.use("/webhook", webhookRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
