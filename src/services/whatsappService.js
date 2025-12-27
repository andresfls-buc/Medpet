// src/services/whatsappService.js
import { sendToWhatsApp } from "../httpRequest/sendToWhatsApp.js";

// ================================
// MENSAJE DE TEXTO
// ================================
export const sendTextMessage = async (to, text) => {
  const body = {
    messaging_product: "whatsapp",
    to,
    text: {
      body: text,
    },
  };

  return sendToWhatsApp(body);
};

// ================================
// MENSAJE CON BOTONES
// ================================
export const sendButtonMessage = async (to, text) => {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: {
        text: text || "Elige una opción 👇",
      },
      action: {
        buttons: [
          { type: "reply", reply: { id: "BTN_1", title: "Agendar una cita" } },
          { type: "reply", reply: { id: "BTN_2", title: "Consultar" } },
          { type: "reply", reply: { id: "BTN_3", title: "Ubicación" } },
        ],
      },
    },
  };

  return sendToWhatsApp(payload);
};

// ================================
// MENSAJE DE UBICACIÓN
// ================================
export const sendLocationMessage = async (
  to,
  latitude,
  longitude,
  name = "Veterinaria MedPet"
) => {
  const body = {
    messaging_product: "whatsapp",
    to,
    type: "location",
    location: {
      latitude,
      longitude,
      name,
      address: "Calle Principal 123, Ciudad, País",
    },
  };

  return sendToWhatsApp(body);
};
