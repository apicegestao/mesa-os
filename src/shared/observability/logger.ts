type LogLevel = "debug" | "info" | "warn" | "error";
type LogContext = Record<string, boolean | number | string | null | undefined>;

const ranks: Record<LogLevel, number> = { debug: 10, info: 20, warn: 30, error: 40 };

function configuredLevel(): LogLevel {
  const value = process.env.LOG_LEVEL;
  return value === "debug" || value === "warn" || value === "error" ? value : "info";
}

export function log(level: LogLevel, message: string, context: LogContext = {}) {
  if (ranks[level] < ranks[configuredLevel()]) return;
  const entry = JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...context });
  if (level === "error") console.error(entry);
  else if (level === "warn") console.warn(entry);
  else console.info(entry);
}
