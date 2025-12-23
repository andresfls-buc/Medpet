import "dotenv/config";

export const PORT = process.env.PORT || 3001;
export const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
export const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
export const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
export const API_VERSION = process.env.API_VERSION || "v22.0";
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

