import express from "express";
import webhookRoutes from "./routes/webhookRoutes.js";

const app = express();

// 🔹 FIX CRÍTICO: fallback de puerto
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Health check (Railway + debug)
app.get("/", (req, res) => {
  res.status(200).send("OK");
});

// Webhook
app.use("/webhook", webhookRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
