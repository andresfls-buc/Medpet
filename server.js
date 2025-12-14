import express from "express";
import fetch from "node-fetch";
import "dotenv/config";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const API_VERSION = process.env.API_VERSION;

/* =======================
   WEBHOOK VERIFICATION
======================= */
app.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

/* =======================
   RECEIVE MESSAGES
======================= */
app.post("/", async (req, res) => {
  console.log("📩 Incoming message:");
  console.log(JSON.stringify(req.body, null, 2));

  const message =
    req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) {
    console.log("ℹ️ No message found");
    return res.sendStatus(200);
  }

  const from = message.from;

  // Función para normalizar texto y eliminar acentos
  const normalizeText = (str) =>
    str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  try {
    /* =======================
       TEXT MESSAGE
    ======================= */
    if (message.type === "text") {
      const text = normalizeText(message.text.body.trim());
      console.log(`💬 ${from}: ${text}`);

      // 👉 IMAGEN ALEATORIA
      if (text === "imagen") {
        const randomSeed = Math.floor(Math.random() * 1000);
        const imageUrl = `https://picsum.photos/400/400?random=${randomSeed}`;

        await fetch(
          `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: from,
              type: "image",
              image: { link: imageUrl }
            }),
          }
        );

        return res.sendStatus(200);
      }

      // 👉 BOTONES (reconoce "boton" con o sin tilde)
      if (text === "boton") {
        await fetch(
          `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messaging_product: "whatsapp",
              to: from,
              type: "interactive",
              interactive: {
                type: "button",
                body: { text: "Elige una opción 👇" },
                action: {
                  buttons: [
                    { type: "reply", reply: { id: "BTN_1", title: "Botón 1" } },
                    { type: "reply", reply: { id: "BTN_2", title: "Botón 2" } }
                  ]
                }
              }
            }),
          }
        );

        return res.sendStatus(200);
      }

      // 👉 ECO (default)
      await fetch(
        `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: message.text.body },
          }),
        }
      );

      return res.sendStatus(200);
    }

    /* =======================
       BUTTON RESPONSE
    ======================= */
    if (message.type === "interactive") {
      const buttonId = message.interactive.button_reply.id;
      console.log(`🔘 Button clicked: ${buttonId}`);

      let replyText = "Opción no reconocida";

      if (buttonId === "BTN_1") replyText = "Elegiste Botón 1 ✅";
      if (buttonId === "BTN_2") replyText = "Elegiste Botón 2 ✅";

      await fetch(
        `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: from,
            text: { body: replyText },
          }),
        }
      );

      return res.sendStatus(200);
    }

    console.log("ℹ️ Message type not handled:", message.type);
    return res.sendStatus(200);

  } catch (error) {
    console.error("🔥 Error handling message:", error);
    return res.sendStatus(500);
  }
});

/* =======================
   START SERVER
======================= */
app.listen(PORT, () => {
  console.log(`🚀 Listening on port ${PORT}`);
});
