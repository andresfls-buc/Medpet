import { VERIFY_TOKEN } from "../config/env.js";
import { handleMessage } from "../services/messageHandler.js";
import { getFirstName } from "../utils/getFirstName.js";

export const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  }

  console.warn("❌ WEBHOOK VERIFICATION FAILED");
  return res.sendStatus(403);
};

export const receiveMessage = async (req, res) => {
  console.log("📩 Incoming webhook:");
  console.log(JSON.stringify(req.body, null, 2));

  const value = req.body.entry?.[0]?.changes?.[0]?.value;

  // 🔹 Meta envía muchos eventos que NO son mensajes
  if (!value || !value.messages) {
    console.log("ℹ️ Evento sin mensaje (status/read/delivery)");
    return res.sendStatus(200);
  }

  const message = value.messages[0];

  // Extraer nombre del contacto (seguro)
  const fullName =
    value.contacts?.[0]?.profile?.name || "amigo";

  const name = getFirstName(fullName);

  console.log("✉️ Mensaje recibido:", message.text?.body || "[no-text]");

  try {
    await handleMessage(message, name);
    return res.sendStatus(200);
  } catch (error) {
    console.error("❌ Error handling message:", error);
    return res.sendStatus(500);
  }
};
