import { sendTextMessage } from "./whatsappService.js";
import { sendEmergencyContact } from "./whatsappService.js";
import { userSessions } from "../utils/userSessions.js";

// ================================
// MENÚ DE FEEDBACK (POR NÚMEROS)
// ================================
export const sendFeedbackMenu = async (to) => {
  const message = `
¿Te fue util la respuesta?

1️⃣ Si fue útil  
2️⃣ Hacer otra consulta  
3️⃣ Emergencias

Responde con el número 👇
  `;

  await sendTextMessage(to, message);
};

// ================================
// MANEJO DEL FEEDBACK
// ================================
export const handleFeedbackText = async (from, text) => {
  const option = text.trim();

  switch (option) {
    case "1":
      // ✅ TERMINA EL FLUJO
      delete userSessions[from];
      return sendTextMessage(
        from,
        "🙏 ¡Gracias por confiar en Medpet! 🐾\nQue tengas un excelente día."
      );

    case "2":
      userSessions[from] = { type: "CONSULTATION" };
      return sendTextMessage(from, "🩺 Describe el problema de tu mascota.");

    case "3":
      await sendTextMessage(
        from,
        "🚨 *Contacto de emergencias Medpet*"
      );

      await sendEmergencyContact(from);
      delete userSessions[from]; // opcional, también termina flujo
      return;

    default:
      return sendTextMessage(
        from,
        "❌ Opción inválida. Responde 1, 2 o 3."
      );
  }
};
