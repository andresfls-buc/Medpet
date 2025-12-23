// ================================
// src/services/openAiService.js
// ================================

import OpenAI from "openai";
import { OPENAI_API_KEY } from "../config/env.js";

// Inicializa el cliente de OpenAI
const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

// Prompt del sistema (rol fijo)
const SYSTEM_PROMPT = `
Actúa como un veterinario profesional.
Responde claro y simple.
Texto plano.
No saludes.
No hagas preguntas.
Responde solo la consulta.
`;

// Función principal para consultar a ChatGPT
export const askOpenAI = async (message) => {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // rápido, barato y suficiente para este caso
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
      temperature: 0.3, // respuestas más profesionales y menos creativas
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI error:", error);
    return "No pude procesar tu consulta.";
  }
};
