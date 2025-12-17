import {
  sendTextMessage,
  sendButtonMessage,
} from "./whatsappService.js";

import { isGreetings } from "../utils/isGreetings.js";

// Normaliza el texto para evitar problemas con mayúsculas y acentos
const normalizeText = (str) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

export const handleMessage = async (message, name = "amigo") => {
  const from = message.from;

  // --------------------
  // MANEJO DE MENSAJES DE TEXTO
  // --------------------
  if (message.type === "text") {
    // Se obtiene y normaliza el texto
    const text = normalizeText(message.text.body.trim());

    // Si el mensaje es un saludo, se envía el menú con botones
    if (isGreetings(text)) {
      return sendButtonMessage(
        from,
        `Hola  ${name} 👋, bienvenido a nuestro servicio de veterinaria online. 🐾 \n\n¿En qué puedo ayudarte?`
      );
    }

    // Para cualquier otro texto no se responde nada
    // Esto evita eco
    return null;
  }

  // --------------------
  // MANEJO DE BOTONES INTERACTIVOS
  // --------------------
  if (message.type === "interactive") {
    // Se obtiene el id del botón presionado
    const buttonId = message.interactive.button_reply.id;

    // Acción botón 1
    if (buttonId === "BTN_1") {
      return sendTextMessage(from, "Agendaste una cita");
    }

    // Acción botón 2
    if (buttonId === "BTN_2") {
      return sendTextMessage(from, "Estos son nuestros servicios");
    }

    // Acción botón 3
    if (buttonId === "BTN_3") {
      return sendTextMessage(
        from,
        "Un agente se pondrá en contacto contigo pronto"
      );
    }

    // Si el botón no coincide con ninguno
    return sendTextMessage(from, "Opción no reconocida");
  }

  // --------------------
  // OTROS TIPOS DE MENSAJE
  // --------------------
  console.log("Tipo de mensaje no manejado:", message.type);
  return null;
};
