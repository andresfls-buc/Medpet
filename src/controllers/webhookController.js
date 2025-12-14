import { VERIFY_TOKEN } from "../config/env.js";
import { handleMessage } from "../services/messageHandler.js";

export const verifyWebhook = (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("WEBHOOK VERIFIED");
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
};

export const receiveMessage = async (req, res) => {
  console.log("📩 Incoming message:");
  console.log(JSON.stringify(req.body, null, 2));

  const message = req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

  if (!message) return res.sendStatus(200);

  try {
    await handleMessage(message);
    return res.sendStatus(200);
  } catch (error) {
    console.error(" Error handling message:", error);
    return res.sendStatus(500);
  }
};
