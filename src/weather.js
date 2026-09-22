import { config } from "./config.js";

const API = "https://api.open-meteo.com/v1/forecast";

async function fetchWeather(params) {
  const url = new URL(API);
  url.searchParams.set("latitude", config.latitude);
  url.searchParams.set("longitude", config.longitude);

  for (const [key, value] of Object.entries(params)) {
    url.searchParams.set(key, value);
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Open-Meteo respondeu ${response.status}`);
  }

  return response.json();
}

export const getCurrentWeather = () =>
  fetchWeather({
    current:
      "temperature_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m",
    timezone: "America/Sao_Paulo"
  });

export const getDailyForecast = (days = 3) =>
  fetchWeather({
    forecast_days: String(days),
    daily:
      "weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,rain_sum",
    timezone: "America/Sao_Paulo"
  });

export function weatherText(code) {
  const map = {
    0: "céu limpo",
    1: "principalmente limpo",
    2: "parcialmente nublado",
    3: "nublado",
    45: "neblina",
    48: "neblina",
    51: "garoa fraca",
    53: "garoa moderada",
    55: "garoa forte",
    61: "chuva fraca",
    63: "chuva moderada",
    65: "chuva forte",
    80: "pancadas fracas",
    81: "pancadas moderadas",
    82: "pancadas fortes",
    95: "trovoada",
    96: "trovoada com granizo",
    99: "trovoada com granizo forte"
  };

  return map[code] || "condição não identificada";
}

export function formatCurrent(data) {
  const c = data.current;

  return [
    "🌤️ *Santa Ella — agora*",
    `Temperatura: ${c.temperature_2m}°C`,
    `Sensação: ${c.apparent_temperature}°C`,
    `Condição: ${weatherText(c.weather_code)}`,
    `Chuva no momento: ${c.rain} mm`,
    `Vento: ${c.wind_speed_10m} km/h`
  ].join("\n");
}

export function formatForecast(data) {
  const d = data.daily;
  const lines = ["📅 *Previsão para Santa Ella*"];

  for (let i = 0; i < d.time.length; i++) {
    lines.push(
      `${d.time[i]} — ${weatherText(d.weather_code[i])}; ` +
      `${d.temperature_2m_min[i]}–${d.temperature_2m_max[i]}°C; ` +
      `chance de chuva ${d.precipitation_probability_max[i]}%`
    );
  }

  return lines.join("\n");
}
