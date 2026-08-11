import { z } from "zod";

export const loginSchema = z.object({ email: z.string().trim().toLowerCase().email() });

export type LoginState = { status: "idle" | "sent" | "error"; message?: string };

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
