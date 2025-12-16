import {
  sendTextMessage,
  sendImageMessage,
  sendButtonMessage,
} from "./whatsappService.js";

import { isGreetings } from "../utils/isGreetings.js";

// Normaliza el texto
const normalizeText = (str) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const handleMessage = async (message, name = "amigo") => {
  const from = message.from;

  if (message.type === "text") {
    const text = normalizeText(message.text.body.trim());

    // Saludo
   if (isGreetings(text)) {
  return sendButtonMessage(
    from,
    `👋 Hola *${name}*, bienvenido a nuestro servicio de veterinaria online 🐾\n\n¿En qué puedo ayudarte?`
  );
}


    // Imagen
    if (text === "imagen") {
      const randomSeed = Math.floor(Math.random() * 1000);
      const imageUrl = `https://picsum.photos/400/400?random=${randomSeed}`;
      return sendImageMessage(from, imageUrl);
    }

    // Botones
    if (text === "boton") {
      return sendButtonMessage(from);
    }

    // Eco por defecto
    return sendTextMessage(from, message.text.body);
  }

  if (message.type === "interactive") {
    const buttonId = message.interactive.button_reply.id;

    if (buttonId === "BTN_1") {
      return sendTextMessage(from, "Agendaste una cita");
    }

    if (buttonId === "BTN_2") {
      return sendTextMessage(from, "Estos son nuestros servicios");
    }
    if (buttonId === "BTN_3") {
      return sendTextMessage(from, "Un agente se pondrá en contacto contigo pronto");
    }

    return sendTextMessage(from, "Opción no reconocida");
  }

  console.log("Tipo de mensaje no manejado:", message.type);
  return null;
};
