import express from "express";
import { config } from "./config.js";
import {
  getCurrentWeather,
  getDailyForecast,
  formatCurrent,
  formatForecast
} from "./weather.js";
import { sendWhatsAppText } from "./whatsapp.js";

const app = express();

app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "Santa Ella Alerta"
  });
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === config.verifyToken) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {
  res.sendStatus(200);

  try {
    const message =
      req.body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message || message.type !== "text") return;

    const from = message.from;
    const text = (message.text?.body || "").trim().toLowerCase();

    if (["oi", "olá", "ola", "menu", "ajuda"].includes(text)) {
      await sendWhatsAppText(
        from,
        "🌦️ *Santa Ella Alerta*\n\n" +
        "Digite:\n" +
        "• *agora* — tempo neste momento\n" +
        "• *hoje* — previsão\n" +
        "• *amanhã* — previsão dos próximos dias\n" +
        "• *chuva* — chance de chuva\n" +
        "• *sol* — condição do tempo"
      );
      return;
    }

    const current = await getCurrentWeather();
    const forecast = await getDailyForecast(3);

    if (text === "agora") {
      await sendWhatsAppText(from, formatCurrent(current));
    } else if (
      ["hoje", "chuva", "sol", "amanhã", "amanha", "previsão", "previsao"].includes(text)
    ) {
      await sendWhatsAppText(from, formatForecast(forecast));
    } else {
      await sendWhatsAppText(
        from,
        "Não entendi. Digite *menu* para ver os comandos."
      );
    }
  } catch (error) {
    console.error(error);
  }
});

async function checkRainAlert() {
  try {
    const forecast = await getDailyForecast(1);

    const probability =
      forecast.daily.precipitation_probability_max?.[0] ?? 0;

    if (probability >= config.rainAlertProbability) {
      console.log(`[ALERTA] Chance de chuva: ${probability}%`);
    }
  } catch (error) {
    console.error(
      "Falha no verificador de chuva:",
      error.message
    );
  }
}

app.listen(config.port, () => {
  console.log(`Santa Ella Alerta na porta ${config.port}`);

  checkRainAlert();

  setInterval(
    checkRainAlert,
    config.alertIntervalMs
  );
});
