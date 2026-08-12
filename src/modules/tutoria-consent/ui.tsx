"use client";

import { useActionState } from "react";
import { acceptMesaOSTerms, withdrawMesaOSTutoriaContext } from "./actions";
import type { MesaOSTermsState } from "./data";

const initialState = { status: "idle" as const };

function NoticeSummary({ state }: { state: MesaOSTermsState }) {
  return <details className="tutoria-consent-notice"><summary>Ler aviso completo e recibo</summary><article>{state.bodyMarkdown.split("\n").map((line, index) => line.startsWith("#") ? <p key={index}><strong>{line.replace(/^#+\s*/, "")}</strong></p> : line.startsWith("-") ? <p key={index}>• {line.slice(1).trim()}</p> : line ? <p key={index}>{line.replaceAll("**", "")}</p> : null)}</article><small>Integridade: {state.contentSha256}</small></details>;
}

export function MesaOSTermsGate({ state }: { state: MesaOSTermsState }) {
  const [acceptance, accept] = useActionState(acceptMesaOSTerms, initialState);
  return <section className="ai-budget-card tutoria-memory-card" aria-labelledby="mesa-os-terms-title"><p className="eyebrow">Mesa OS</p><h1 id="mesa-os-terms-title">Termos de Uso</h1><p>Antes de continuar, leia e aceite os Termos de Uso. Eles incluem como o TutorIA usará, de forma segura, o contexto estruturado da sua organização.</p><NoticeSummary state={state} /><form action={accept}><input type="hidden" name="documentVersionId" value={state.documentVersionId} /><label className="consent-check"><input type="checkbox" name="informed" value="yes" required /> Li e aceito esta versão dos Termos de Uso, incluindo o contexto longitudinal automático do TutorIA.</label><button type="submit">Aceitar e continuar</button>{acceptance.message && <p className={`feedback feedback-${acceptance.status}`} role="status">{acceptance.message}</p>}</form></section>;
}

export function MesaOSTermsPanel({ state }: { state: MesaOSTermsState | null }) {
  if (!state) return null;
  if (state.latestEvent === "accepted" && state.automationEnabled) return <section className="ai-budget-card tutoria-memory-card"><p className="eyebrow">Termos de Uso</p><h2>Versão atual aceita</h2><p>O contexto estruturado do TutorIA está ativo nos limites dos Termos. Você pode desligar novas derivações automáticas a qualquer momento.</p><NoticeSummary state={state} /><WithdrawButton state={state} /></section>;
  return <section className="ai-budget-card tutoria-memory-card"><p className="eyebrow">Termos de Uso</p><h2>Contexto automático desativado</h2><p>Você pode reativar o contexto longitudinal do TutorIA aceitando a versão atual dos Termos.</p><NoticeSummary state={state} /><AcceptButton state={state} /></section>;
}

function AcceptButton({ state }: { state: MesaOSTermsState }) {
  const [actionState, action] = useActionState(acceptMesaOSTerms, initialState);
  return <form action={action}><input type="hidden" name="documentVersionId" value={state.documentVersionId} /><label className="consent-check"><input type="checkbox" name="informed" value="yes" required /> Li e aceito a versão atual dos Termos.</label><button type="submit">Aceitar Termos e ativar contexto</button>{actionState.message && <p className={`feedback feedback-${actionState.status}`} role="status">{actionState.message}</p>}</form>;
}

function WithdrawButton({ state }: { state: MesaOSTermsState }) {
  const [actionState, action] = useActionState(withdrawMesaOSTutoriaContext, initialState);
  return <form action={action}><input type="hidden" name="documentVersionId" value={state.documentVersionId} /><button type="submit" className="button-secondary">Desligar novas derivações automáticas</button>{actionState.message && <p className={`feedback feedback-${actionState.status}`} role="status">{actionState.message}</p>}</form>;
}
