import {
  sendTextMessage,
  sendButtonMessage,
} from "./whatsappService.js";

import { isGreetings } from "../utils/isGreetings.js";
import {
  startAppointmentFlow,
  handleAppointmentFlow,
  handleAppointmentButtons,
} from "./appointmentFlow.js";

import { userSessions } from "../utils/userSessions.js";

// ====================
// NORMALIZA TEXTO
// ====================
const normalizeText = (str) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// ====================
// MESSAGE HANDLER
// ====================
export const handleMessage = async (message, name = "amigo") => {
  const from = message.from;

  // ====================
  // MENSAJES DE TEXTO
  // ====================
  if (message.type === "text") {
    const text = normalizeText(message.text.body.trim());

    //  PRIORIDAD TOTAL: si hay sesión activa, NO evaluar saludos
    if (userSessions[from]) {
      return handleAppointmentFlow(from, message.text.body);
    }

    //  Saludo → mostrar menú principal
    if (isGreetings(text)) {
      return sendButtonMessage(
        from,
        `Hola ${name} 👋 Bienvenido a nuestra veterinaria 🐾\n\n¿En qué puedo ayudarte?`,
        [
          { id: "BTN_1", title: "🗓️ Agendar cita" },
          { id: "BTN_2", title: "📋 Ver servicios" },
          { id: "BTN_3", title: "👤 Hablar con un agente" },
        ]
      );
    }

    // Texto fuera de flujo y sin saludo
    return null;
  }

  // ====================
  // BOTONES INTERACTIVOS
  // ====================
  if (message.type === "interactive") {
    const buttonId = message.interactive.button_reply.id;

    //  PRIORIDAD TOTAL: botones del flujo
    if (userSessions[from]) {
      return handleAppointmentButtons(from, buttonId);
    }

    //  Agendar cita (menú principal)
    if (buttonId === "BTN_1") {
      return startAppointmentFlow(from);
    }

    //  Servicios
    if (buttonId === "BTN_2") {
      return sendTextMessage(
        from,
        "🐶 Consulta general\n🐱 Vacunación\n🩺 Emergencias\n✂️ Grooming"
      );
    }

    // 👤 Agente humano
    if (buttonId === "BTN_3") {
      return sendTextMessage(
        from,
        "👤 Un agente se pondrá en contacto contigo pronto."
      );
    }

    return null;
  }

  // ====================
  // OTROS TIPOS
  // ====================
  console.log("Tipo de mensaje no manejado:", message.type);
  return null;
};
