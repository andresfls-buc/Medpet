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
import { askOpenAI } from "./openAiService.js";

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
    const rawText = message.text.body.trim();
    const text = normalizeText(rawText);

    // ====================
    // FLUJO DE CITAS
    // ====================
    if (userSessions[from]?.type === "APPOINTMENT") {
      return handleAppointmentFlow(from, rawText);
    }

    // ====================
    // CONSULTA CON IA (SIN FEEDBACK)
    // ====================
    if (userSessions[from]?.type === "CONSULTATION") {
      let responseText;

      try {
        responseText = await askOpenAI(rawText);
      } catch (e) {
        responseText =
          "⚠️ No pude procesar tu consulta en este momento. Si los síntomas continúan, acude a un veterinario.";
      }

      // Respondemos y TERMINAMOS el flujo
      await sendTextMessage(from, responseText);

      // Cerramos sesión para evitar loops
      delete userSessions[from];
      return;
    }

    // ====================
    // SALUDO → MENÚ (UNA SOLA VEZ)
    // ====================
    if (isGreetings(text) && !userSessions[from]) {
      userSessions[from] = { type: "MENU_USED" };

      return sendButtonMessage(
        from,
        `Hola ${name} 👋 Bienvenido a nuestra veterinaria online\n\n¿En qué puedo ayudarte?`,
        [
          { id: "BTN_1", title: "Agendar cita" },
          { id: "BTN_2", title: "Consultar" },
          { id: "BTN_3", title: "Ubicación" },
        ]
      );
    }

    return;
  }

  // ====================
  // BOTONES
  // ====================
  if (message.type === "interactive") {
    const buttonId =
      message.interactive?.button_reply?.id ||
      message.interactive?.list_reply?.id;

    // Agendar cita
    if (buttonId === "BTN_1") {
      userSessions[from] = { type: "APPOINTMENT" };
      return startAppointmentFlow(from);
    }

    // Consultar
    if (buttonId === "BTN_2") {
      userSessions[from] = { type: "CONSULTATION" };
      return sendTextMessage(
        from,
        "🩺 Escribe qué le ocurre a tu mascota y te ayudaré."
      );
    }

    // Ubicación
    if (buttonId === "BTN_3") {
      return sendTextMessage(
        from,
        "📍 Calle Principal 123\n⏰ Horario: 9am – 6pm"
      );
    }

    // Botones del flujo de citas
    if (userSessions[from]?.type === "APPOINTMENT") {
      return handleAppointmentButtons(from, buttonId);
    }

    return;
  }
};
