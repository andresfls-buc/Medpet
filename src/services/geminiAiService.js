// src/services/geminiService.js
import { TextServiceClient } from "@google/generative-ai";
import config from "../config.js/env.js";

// Crear cliente Gemini AI
const client = new TextServiceClient({
  apiKey: config.GEMINI_API_KEY,
});

// Prompt base (personalidad del bot)
const SYSTEM_PROMPT = `
Comportarte como un veterinario, deberás de resolver las preguntas lo más simple posible.
Responde en texto plano, como si fuera una conversación por WhatsApp.
No saludes.
No generes conversaciones.
Solo responde a la pregunta del usuario.
`;

export const geminiService = async (message) => {
  try {
    const response = await client.generateText({
      model: "gemini-1.5-flash-001",
      prompt: `${SYSTEM_PROMPT}\nPregunta del usuario: ${message}`,
      maxOutputTokens: 500,
    });

    return response.candidates[0].content;
  } catch (error) {
    console.error("Error Gemini AI:", error);
    return "Hubo un error al procesar la solicitud.";
  }
};
