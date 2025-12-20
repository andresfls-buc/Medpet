import { sendTextMessage } from "./whatsappService.js";
import { userSessions } from "../utils/userSessions.js";
import appendToSheet from "./googleSheetsService.js"; // Ruta corregida: misma carpeta

/*
================================================
 INICIA EL FLUJO DE AGENDAR CITA
================================================
*/
export const startAppointmentFlow = async (from) => {
  // Crea una sesión nueva para el usuario
  userSessions[from] = {
    step: "ASK_NAME", // Paso actual del flujo
    data: {},         // Aquí se guardan los datos del usuario
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
  if (!session) return; // Si no hay sesión activa, no hace nada

  switch (session.step) {

    case "ASK_NAME":
      session.data.ownerName = text;        // Guarda nombre del dueño
      session.step = "ASK_PET_NAME";        // Avanza al siguiente paso
      return sendTextMessage(
        from,
        "🐾 ¿Cuál es el nombre de tu mascota?"
      );

    case "ASK_PET_NAME":
      session.data.petName = text;          // Guarda nombre de la mascota
      session.step = "ASK_PET_TYPE";        // Avanza al siguiente paso
      return sendTextMessage(
        from,
        "🐶 ¿Qué tipo de animal es?\n(Ej: perro, gato, conejo)"
      );

    case "ASK_PET_TYPE":
      session.data.petType = text;          // Guarda tipo de mascota
      session.step = "ASK_REASON";          // Avanza al siguiente paso
      return sendTextMessage(
        from,
        "🩺 ¿Cuál es el motivo de la consulta?\n\n" +
        "Opciones:\n" +
        "- Chequeo mensual\n" +
        "- Corte\n" +
        "- Urgencia"
      );

    case "ASK_REASON":
      session.data.reason = text;           // Guarda motivo de la cita
      session.step = "ASK_DATE";            // Avanza al siguiente paso
      return sendTextMessage(
        from,
        "📅 ¿Qué fecha deseas para la cita?\n(Ej: 20/12/2025)"
      );

    case "ASK_DATE":
      session.data.date = text;             // Guarda fecha
      session.step = "ASK_TIME";            // Avanza al siguiente paso
      return sendTextMessage(
        from,
        "⏰ ¿A qué hora sería la cita? (Ej: 15:30)"
      );

    case "ASK_TIME":
      session.data.time = text;             // Guarda hora

      const { ownerName, petName, petType, reason, date, time } = session.data;

      // Mensaje final de confirmación al usuario
      await sendTextMessage(
        from,
        `✅ *Cita confirmada*\n\n` +
        ` Dueño: ${ownerName}\n` +
        `Mascota: ${petName}\n` +
        ` Tipo: ${petType}\n` +
        ` Motivo: ${reason}\n` +
        ` Fecha: ${date}\n` +
        ` Hora: ${time}\n\n` +
        `¡Un agente se pondrá en contacto contigo pronto! 🤝`
      );

      // ------------------------------
      // GUARDAR DATOS EN GOOGLE SHEETS
      // ------------------------------
      try {
        // Enviamos los datos como arreglo, en el mismo orden que en la hoja
        await appendToSheet([from,ownerName, petName, petType, reason, date, time]);
        console.log("Datos guardados en Google Sheets correctamente");
      } catch (error) {
        console.error("Error guardando en Google Sheets:", error);
      }

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
  
};
