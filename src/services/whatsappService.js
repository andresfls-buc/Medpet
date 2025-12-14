import fetch from "node-fetch";
import { WHATSAPP_TOKEN, PHONE_NUMBER_ID, API_VERSION } from "../config/env.js";

export const sendTextMessage = async (to, text) => {
  const body = {
    messaging_product: "whatsapp",
    to,
    text: { body: text },
  };

  return callWhatsAppAPI(body);
};

export const sendImageMessage = async (to, imageUrl) => {
  const body = {
    messaging_product: "whatsapp",
    to,
    type: "image",
    image: { link: imageUrl },
  };

  return callWhatsAppAPI(body);
};

export const sendButtonMessage = async (to) => {
  const body = {
    messaging_product: "whatsapp",
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: "Elige una opción 👇" },
      action: {
        buttons: [
          { type: "reply", reply: { id: "BTN_1", title: "Botón 1" } },
          { type: "reply", reply: { id: "BTN_2", title: "Botón 2" } },
        ],
      },
    },
  };

  return callWhatsAppAPI(body);
};

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
