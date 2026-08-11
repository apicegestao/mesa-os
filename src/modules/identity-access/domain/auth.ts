import { z } from "zod";

export const loginSchema = z.object({ email: z.string().trim().toLowerCase().email() });

export type LoginState = { status: "idle" | "sent" | "error"; message?: string };

export const genericLoginMessage =
  "Se o e-mail estiver autorizado, você receberá um link de acesso em instantes.";

export function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/app";
}
