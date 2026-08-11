import { z } from "zod";

export const loginSchema = z.object({ email: z.string().trim().toLowerCase().email() });

export const passwordLoginSchema = loginSchema.extend({
  password: z.string().min(12).max(128),
});

export const passwordSetupSchema = z.object({
  password: z.string().min(12).max(128),
  confirmation: z.string().min(12).max(128),
}).refine((value) => value.password === value.confirmation, {
  message: "As senhas precisam ser iguais.",
  path: ["confirmation"],
});

export type LoginState = { status: "idle" | "sent" | "success" | "error"; message?: string };

export const genericLoginMessage =
  "Se o e-mail estiver autorizado, você receberá um link de acesso em instantes.";

export function safeNextPath(value: string | null) {
  return value?.startsWith("/") && !value.startsWith("//") ? value : "/app";
}

export function authRedirectBaseUrl(productionUrl: string, deployUrl?: string, deployContext?: string) {
  if (deployContext !== "deploy-preview" && deployContext !== "branch-deploy") return productionUrl;
  if (!deployUrl) return productionUrl;
  try {
    const url = new URL(deployUrl);
    const approvedHost = url.protocol === "https:" && url.hostname.endsWith("--mesa-os.netlify.app");
    return approvedHost ? url.origin : productionUrl;
  } catch {
    return productionUrl;
  }
}
