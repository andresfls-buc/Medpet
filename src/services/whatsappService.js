import fetch from "node-fetch";
import { WHATSAPP_TOKEN, PHONE_NUMBER_ID, API_VERSION } from "../config/env.js";

//Servicio para enviar mensajes a través de la API de WhatsApp
export const sendTextMessage = async (to, text) => {
  const body = {
    messaging_product: "whatsapp",
    to,
    text: { body: text },
  };

  return callWhatsAppAPI(body);
};


//Servicio para enviar botones a través de la API de WhatsApp
export const sendButtonMessage = async (to , text) => {
  const payload = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: text || "Elige una opción 👇" },
      action: {
        buttons: [
          { type: "reply", reply: { id: "BTN_1", title: "Agendar una cita" } },
          { type: "reply", reply: { id: "BTN_2", title: "Servicios" } },
          { type: "reply", reply: { id: "BTN_3", title: "Hablar con un agente" } },
        ],
      },
    },
  };

  return callWhatsAppAPI(payload);
};

// Función genérica para llamar a la API de WhatsApp
const callWhatsAppAPI = async (body) => {
  const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  if (!res.ok) console.error(" WhatsApp API error:", data);
  return data;
};
