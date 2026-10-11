import "dotenv/config";

const DEFAULT_PORT = 3333;
const DEFAULT_HOST = "127.0.0.1";

function readPort(value: string | undefined): number {
  if (value === undefined || value.trim() === "") return DEFAULT_PORT;
  if (!/^\d+$/.test(value.trim())) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  const port = Number(value);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
}

function readCorsOrigins(value: string | undefined): string[] {
  if (value === undefined || value.trim() === "") return [];

  const origins = value.split(",").map((entry) => entry.trim());
  for (const origin of origins) {
    let parsed: URL;
    try {
      parsed = new URL(origin);
    } catch {
      throw new Error("CORS_ORIGINS must contain comma-separated HTTP(S) origins.");
    }

    if (!["http:", "https:"].includes(parsed.protocol) || parsed.origin !== origin) {
      throw new Error("CORS_ORIGINS entries must be HTTP(S) origins without paths.");
    }
  }

  return [...new Set(origins)];
}

export const config = Object.freeze({
  host: process.env.HOST?.trim() || DEFAULT_HOST,
  port: readPort(process.env.PORT),
  corsOrigins: readCorsOrigins(process.env.CORS_ORIGINS),
});
