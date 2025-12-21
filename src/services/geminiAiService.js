// src/services/geminiService.js
import { TextServiceClient } from "@google/generative-ai";
import config from "../config.js/env.js";

// Crear cliente Gemini AI
const client = new TextServiceClient({
  apiKey: config.GEMINI_API_KEY, // Asegúrate de tener tu API key de Gemini
});

export const geminiService = async (message) => {
  try {
    const response = await client.generateText({
      model: "gemini-1.5-pro", // Modelo de texto de Gemini AI
      prompt: message,
      maxOutputTokens: 500, // Ajusta según necesidad
    });

    return response.candidates[0].content; // Gemini devuelve un array de candidatos
  } catch (error) {
    console.error("Error Gemini AI:", error);
    return "Hubo un error al procesar la solicitud.";
  }
};
