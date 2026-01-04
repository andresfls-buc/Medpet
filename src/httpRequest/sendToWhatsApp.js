import fetch from "node-fetch";
import {
  WHATSAPP_BASE_URL,
  WHATSAPP_TOKEN,
  PHONE_NUMBER_ID,
  API_VERSION,
} from "../config/env.js";

/**
 * 🔹 Ajuste 1:
 * Validación temprana de variables críticas.
 * Razón:
 * - Evita errores silenciosos en Railway
 * - Si una variable no existe, lo sabrás INMEDIATAMENTE
 */
if (!WHATSAPP_BASE_URL || !WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
  throw new Error(
    "❌ Missing WhatsApp environment variables (BASE_URL, TOKEN or PHONE_NUMBER_ID)"
  );
}

/**
 * 🔹 Ajuste 2:
 * Construcción explícita del BASE_URL.
 * Razón:
 * - Más claro
 * - Evita errores si el BASE_URL termina o no en '/'
 */
const BASE_URL = `${WHATSAPP_BASE_URL}/${API_VERSION}`;

/**
 * Función única para enviar requests a la API de WhatsApp
 * @param {Object} body - Payload del mensaje
 */
export const sendToWhatsApp = async (body) => {
  try {
    const url = `${BASE_URL}/${PHONE_NUMBER_ID}/messages`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${WHATSAPP_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    /**
     * 🔹 Ajuste 3:
     * Manejo seguro del JSON.
     * Razón:
     * - Si Meta responde sin body (raro, pero pasa),
     *   res.json() lanza error y rompe el flujo
     */
    const text = await res.text();
    const data = text ? JSON.parse(text) : {};

    if (!res.ok) {
      console.error("❌ WhatsApp API error:");
      console.error("Status:", res.status);
      console.error("Response:", data);
    }

    return data;
  } catch (error) {
    /**
     * 🔹 Ajuste 4 (menor):
     * Log más explícito
     * Razón:
     * - En Railway los logs son tu único debugger
     */
    console.error("❌ Error calling WhatsApp API:", error);
    throw error;
  }
};
