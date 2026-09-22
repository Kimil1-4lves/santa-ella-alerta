import { config } from "./config.js";

const base = `https://graph.facebook.com/${config.apiVersion}`;

export async function sendWhatsAppText(to, body) {
  const response = await fetch(
    `${base}/${config.phoneNumberId}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: {
          body,
          preview_url: false
        }
      })
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`WhatsApp API: ${JSON.stringify(data)}`);
  }

  return data;
}
