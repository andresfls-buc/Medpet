import { sendToWhatsApp } from "../httpRequest/sendToWhatsApp.js";

// ================================
// MENSAJE DE TEXTO
// ================================
export const sendTextMessage = async (to, text) => {
  return sendToWhatsApp({
    messaging_product: "whatsapp",
    to,
    text: { body: text },
  });
};

// ================================
// MENÚ CON BOTONES (MÁXIMO 3)
// ================================
export const sendButtonMessage = async (to, text) => {
  return sendToWhatsApp({
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text },
      action: {
        buttons: [
          { type: "reply", reply: { id: "BTN_1", title: "Agendar cita" } },
          { type: "reply", reply: { id: "BTN_2", title: "Consultar" } },
          { type: "reply", reply: { id: "BTN_3", title: "Ubicación" } },
        ],
      },
    },
  });
};

// ================================
// UBICACIÓN
// ================================
export const sendLocationMessage = async (to, latitude, longitude, name) => {
  return sendToWhatsApp({
    messaging_product: "whatsapp",
    to,
    type: "location",
    location: {
      latitude,
      longitude,
      name,
      address: "Calle Principal 123",
    },
  });
};

// ================================
// ✅ CONTACTO (ESTRUCTURA VÁLIDA)
// ================================
export const sendEmergencyContact = async (to) => {
  return sendToWhatsApp({
    messaging_product: "whatsapp",
    to,
    type: "contacts",
    contacts: [
      {
        name: {
          formatted_name: "MedPet Emergencias",
          first_name: "MedPet",
        },
        phones: [
          {
            phone: "573001234567", // ⚠️ SIN +
            wa_id: "573001234567",
            type: "WORK",
          },
        ],
      },
    ],
  });
};
