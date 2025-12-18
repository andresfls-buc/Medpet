import { sendTextMessage } from "./whatsappService.js";
import { userSessions } from "../utils/userSessions.js";

/*
================================================
 INICIA EL FLUJO DE AGENDAR CITA
================================================
*/
export const startAppointmentFlow = async (from) => {
  // Crea una sesión nueva para el usuario
  userSessions[from] = {
    step: "ASK_NAME", // Paso actual del flujo
    data: {},         // Aquí se guardan los datos
  };

  // Primer mensaje del flujo
  await sendTextMessage(
    from,
    "😊 Perfecto, vamos a agendar tu cita.\n\n👉 ¿Cuál es tu nombre?"
  );
};

/*
================================================
 MANEJA MENSAJES DE TEXTO DURANTE EL FLUJO
================================================
*/
export const handleAppointmentFlow = async (from, text) => {
  const session = userSessions[from];
  if (!session) return; // Si no hay sesión, no hace nada

  switch (session.step) {

    // ---------------------------------
    // NOMBRE DEL DUEÑO
    // ---------------------------------
    case "ASK_NAME":
      session.data.ownerName = text;        // Guarda nombre
      session.step = "ASK_PET_NAME";        // Avanza
      return sendTextMessage(
        from,
        "🐾 ¿Cuál es el nombre de tu mascota?"
      );

    // ---------------------------------
    // NOMBRE DE LA MASCOTA
    // ---------------------------------
    case "ASK_PET_NAME":
      session.data.petName = text;          // Guarda mascota
      session.step = "ASK_PET_TYPE";        // Avanza
      return sendTextMessage(
        from,
        "🐶 ¿Qué tipo de animal es?\n(Ej: perro, gato, conejo)"
      );

    // ---------------------------------
    // TIPO DE MASCOTA (TEXTO)
    // ---------------------------------
    case "ASK_PET_TYPE":
      session.data.petType = text;          // Guarda tipo
      session.step = "ASK_REASON";          // Avanza
      return sendTextMessage(
        from,
        "🩺 ¿Cuál es el motivo de la consulta?\n\n" +
        "Opciones:\n" +
        "- Chequeo mensual\n" +
        "- Corte\n" +
        "- Urgencia"
      );

    // ---------------------------------
    // MOTIVO DE CONSULTA (TEXTO)
    // ---------------------------------
    case "ASK_REASON":
      session.data.reason = text;           // Guarda motivo
      session.step = "ASK_DATE";            // Avanza
      return sendTextMessage(
        from,
        "📅 ¿Qué fecha deseas para la cita?\n(Ej: 20/12/2025)"
      );

    // ---------------------------------
    // FECHA DE LA CITA
    // ---------------------------------
    case "ASK_DATE":
      session.data.date = text;             // Guarda fecha
      session.step = "ASK_TIME";             // Avanza
      return sendTextMessage(
        from,
        "⏰ ¿A qué hora sería la cita? (Ej: 15:30)"
      );

    // ---------------------------------
    // HORA Y CONFIRMACIÓN FINAL
    // ---------------------------------
    case "ASK_TIME":
      session.data.time = text;             // Guarda hora

      const {
        ownerName,
        petName,
        petType,
        reason,
        date,
        time,
      } = session.data;

      // Mensaje final de confirmación
      await sendTextMessage(
        from,
        `✅ *Cita confirmada*\n\n` +
        ` Dueño: ${ownerName}\n` +
        `Mascota: ${petName}\n` +
        ` Tipo: ${petType}\n` +
        ` Motivo: ${reason}\n` +
        ` Fecha: ${date}\n` +
        ` Hora: ${time}\n\n` +
        `¡Te esperamos! 🤝`
      );

      // Borra la sesión (flujo terminado)
      delete userSessions[from];
      return;
  }
};

/*
================================================
 YA NO USAMOS BOTONES EN EL FLUJO
================================================
*/
export const handleAppointmentButtons = async () => {
  // Intencionalmente vacío
};
