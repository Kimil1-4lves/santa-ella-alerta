import "dotenv/config";

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Variável obrigatória ausente: ${name}`);
  return value;
}

export const config = {
  port: Number(process.env.PORT || 3000),
  verifyToken: required("WEBHOOK_VERIFY_TOKEN"),
  accessToken: required("WHATSAPP_ACCESS_TOKEN"),
  phoneNumberId: required("WHATSAPP_PHONE_NUMBER_ID"),
  apiVersion: process.env.WHATSAPP_API_VERSION || "v23.0",
  latitude: Number(process.env.LATITUDE || -23.44),
  longitude: Number(process.env.LONGITUDE || -47.06),
  alertIntervalMs: Number(process.env.ALERT_INTERVAL_MS || 900000),
  rainAlertProbability: Number(process.env.RAIN_ALERT_PROBABILITY || 70)
};
