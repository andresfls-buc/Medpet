import {
  sendTextMessage,
  sendButtonMessage,
  sendLocationMessage,
  sendEmergencyContact
} from "./whatsappService.js";

import { isGreetings } from "../utils/isGreetings.js";
import {
  startAppointmentFlow,
  handleAppointmentFlow,
  handleAppointmentButtons,
} from "./appointmentFlow.js";

import { userSessions } from "../utils/userSessions.js";
import { askOpenAI } from "./openAiService.js";

import {
  sendFeedbackMenu,
  handleFeedbackText
} from "./feedbackFlow.js";

// ====================
// NORMALIZA TEXTO
// ====================
const normalizeText = (str) =>
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");

// ====================
// DETECTA EMERGENCIAS
// ====================
const isEmergencyResponse = (text) => {
  const keywords = [
    "emergencia",
    "urgente",
    "no respira",
    "convulsion",
    "convulsión",
    "sangrado",
    "inconsciente",
    "envenenamiento",
    "grave",
    "ataque",
  ];
  return keywords.some(k => text.includes(k));
};

// ====================
// HANDLE MESSAGE
// ====================
export const handleMessage = async (message, name = "amigo") => {
  const from = message.from;

  // 🔐 asegurar sesión
  if (!userSessions[from]) {
    userSessions[from] = { type: "MENU" };
  }

  const currentSession = userSessions[from];

  // ====================
  // TEXTO
  // ====================
  if (message.type === "text") {
    const rawText = message.text.body.trim();
    const text = normalizeText(rawText);

    // ===== CITAS =====
    if (currentSession.type === "APPOINTMENT") {
      return handleAppointmentFlow(from, rawText);
    }

    // ===== FEEDBACK =====
    if (currentSession.type === "FEEDBACK") {
      return handleFeedbackText(from, rawText);
    }

    // ===== CONSULTA =====
    if (currentSession.type === "CONSULTATION") {
      let aiResponse;

      try {
        aiResponse = await askOpenAI(rawText);
      } catch {
        aiResponse = "⚠️ No pude procesar tu consulta automáticamente.";
      }

      await sendTextMessage(from, aiResponse);

      // 🚨 EMERGENCIA DETECTADA
      if (isEmergencyResponse(text)) {
        await sendTextMessage(
          from,
          "🚨 *EMERGENCIA DETECTADA*\nTe comparto el contacto de Medpet:"
        );
        await sendEmergencyContact(from);
        userSessions[from] = { type: "MENU" };
        return;
      }

      // 👉 feedback
      userSessions[from] = { type: "FEEDBACK" };
      return sendFeedbackMenu(from);
    }

    // ===== SALUDO =====
    if (isGreetings(text)) {
      userSessions[from] = { type: "MENU" };
      return sendButtonMessage(
        from,
        `Hola ${name} 👋 Bienvenido a Medpet tu veterinaria online favorita 🐾\n\n¿En qué puedo ayudarte?`
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

    if (!buttonId) return;

    switch (currentSession.type) {

      // ===== MENÚ PRINCIPAL =====
      case "MENU":
        switch (buttonId) {

          case "BTN_1": // CITA
            userSessions[from] = { type: "APPOINTMENT" };
            return startAppointmentFlow(from);

          case "BTN_2": // CONSULTA
            userSessions[from] = { type: "CONSULTATION" };
            return sendTextMessage(
              from,
              "🩺 Describe el problema de tu mascota."
            );

          case "BTN_3": // UBICACIÓN
            await sendLocationMessage(
              from,
              4.710989,
              -74.072090,
              "Veterinaria Medpet"
            );
            await sendTextMessage(
              from,
              "Estamos en la calle Principal 123."
            );
            userSessions[from] = { type: "MENU" };
            return;
        }
        return;

      // ===== CITAS =====
      case "APPOINTMENT":
        return handleAppointmentButtons(from, buttonId);

      default:
        userSessions[from] = { type: "MENU" };
        return;
    }
  }
};
