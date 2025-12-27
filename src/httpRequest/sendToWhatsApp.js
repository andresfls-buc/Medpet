// src/httpRequest/sendToWhatsApp.js
import fetch from "node-fetch";
import {
  WHATSAPP_TOKEN,
  PHONE_NUMBER_ID,
  API_VERSION,
} from "../config/env.js";

/**
 * Función única para enviar requests a la API de WhatsApp
 * @param {Object} body - Payload del mensaje
 */
export const sendToWhatsApp = async (body) => {
  try {
    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${WHATSAPP_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      console.error("❌ WhatsApp API error:", data);
    }

    return data;
  } catch (error) {
    console.error("❌ Error calling WhatsApp API:", error.message);
    throw error;
  }
};
