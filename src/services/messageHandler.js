import { sendTextMessage, sendImageMessage, sendButtonMessage } from "./whatsappService.js";

// Normaliza el texto
const normalizeText = (str) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const handleMessage = async (message) => {
  const from = message.from;

  if (message.type === "text") {
    const text = normalizeText(message.text.body.trim());

    if (text === "imagen") {
      const randomSeed = Math.floor(Math.random() * 1000);
      const imageUrl = `https://picsum.photos/400/400?random=${randomSeed}`;
      return sendImageMessage(from, imageUrl);
    }

    if (text === "boton") {
      return sendButtonMessage(from);
    }

    // Eco por defecto
    return sendTextMessage(from, message.text.body);
  }

  if (message.type === "interactive") {
    const buttonId = message.interactive.button_reply.id;
    let replyText = "Opción no reconocida";

    if (buttonId === "BTN_1") replyText = "Elegiste Botón 1 ✅";
    if (buttonId === "BTN_2") replyText = "Elegiste Botón 2 ✅";

    return sendTextMessage(from, replyText);
  }

  console.log("ℹ️ Tipo de mensaje no manejado:", message.type);
  return null;
};
