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
      return sendTextMessage(
        from,
        `Hola, ${name} Bienvenido a nuestro servicio de veterinaria online . ¿Cómo puedo ayudarte?`
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
      return sendTextMessage(from, "Elegiste Botón 1");
    }

    if (buttonId === "BTN_2") {
      return sendTextMessage(from, "Elegiste Botón 2");
    }

    return sendTextMessage(from, "Opción no reconocida");
  }

  console.log("Tipo de mensaje no manejado:", message.type);
  return null;
};
