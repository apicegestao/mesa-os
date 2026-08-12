"use client";

import { useActionState } from "react";
import { activateTutorIAContext, withdrawTutorIAContext } from "./actions";
import type { TutorIAContextConsentState } from "./data";

const initialState = { status: "idle" as const };

function NoticeSummary({ state }: { state: TutorIAContextConsentState }) {
  return <details className="tutoria-consent-notice"><summary>Ler aviso completo e recibo</summary><article>{state.bodyMarkdown.split("\n").map((line, index) => line.startsWith("#") ? <p key={index}><strong>{line.replace(/^#+\s*/, "")}</strong></p> : line.startsWith("-") ? <p key={index}>• {line.slice(1).trim()}</p> : line ? <p key={index}>{line.replaceAll("**", "")}</p> : null)}</article><small>Integridade: {state.contentSha256}</small></details>;
}

export function TutorIAContextConsentGate({ state }: { state: TutorIAContextConsentState }) {
  const [activation, activate] = useActionState(activateTutorIAContext, initialState);
  const [withdrawal, withdraw] = useActionState(withdrawTutorIAContext, initialState);
  return <section className="ai-budget-card tutoria-memory-card" aria-labelledby="tutoria-context-choice-title"><p className="eyebrow">TutorIA personalizado</p><h1 id="tutoria-context-choice-title">Como o TutorIA pode acompanhar sua jornada</h1><p>Você decide se autoriza o uso automático de dados estruturados da sua própria empresa para tornar as orientações mais úteis. Conversas livres, dados sensíveis e informações de outras organizações ficam fora.</p><NoticeSummary state={state} /><div className="tutoria-consent-actions"><form action={activate}><input type="hidden" name="documentVersionId" value={state.documentVersionId} /><label className="consent-check"><input type="checkbox" name="informed" value="yes" required /> Li o aviso e autorizo o contexto automático nos limites informados.</label><button type="submit">Ativar contexto automático</button>{activation.message && <p className={`feedback feedback-${activation.status}`} role="status">{activation.message}</p>}</form><form action={withdraw}><input type="hidden" name="documentVersionId" value={state.documentVersionId} /><button type="submit" className="button-secondary">Continuar sem contexto automático</button>{withdrawal.message && <p className={`feedback feedback-${withdrawal.status}`} role="status">{withdrawal.message}</p>}</form></div></section>;
}

export function TutorIAContextConsentPanel({ state }: { state: TutorIAContextConsentState | null }) {
  if (!state) return null;
  if (state.latestEvent === "accepted" && state.automationEnabled) return <section className="ai-budget-card tutoria-memory-card"><p className="eyebrow">Contexto do TutorIA</p><h2>Personalização automática ativa</h2><p>O TutorIA pode usar os registros estruturados autorizados da sua organização. Você pode retirar essa autorização a qualquer momento.</p><NoticeSummary state={state} /><WithdrawButton state={state} /></section>;
  return <section className="ai-budget-card tutoria-memory-card"><p className="eyebrow">Contexto do TutorIA</p><h2>Personalização automática desativada</h2><p>O Mesa OS continua funcionando normalmente. Se desejar, você pode ativar o contexto longitudinal do TutorIA para sua organização.</p><NoticeSummary state={state} /><ActivateButton state={state} /></section>;
}

function ActivateButton({ state }: { state: TutorIAContextConsentState }) {
  const [actionState, action] = useActionState(activateTutorIAContext, initialState);
  return <form action={action}><input type="hidden" name="documentVersionId" value={state.documentVersionId} /><label className="consent-check"><input type="checkbox" name="informed" value="yes" required /> Li o aviso e autorizo esta ativação.</label><button type="submit">Ativar contexto automático</button>{actionState.message && <p className={`feedback feedback-${actionState.status}`} role="status">{actionState.message}</p>}</form>;
}

function WithdrawButton({ state }: { state: TutorIAContextConsentState }) {
  const [actionState, action] = useActionState(withdrawTutorIAContext, initialState);
  return <form action={action}><input type="hidden" name="documentVersionId" value={state.documentVersionId} /><button type="submit" className="button-secondary">Desligar novas derivações automáticas</button>{actionState.message && <p className={`feedback feedback-${actionState.status}`} role="status">{actionState.message}</p>}</form>;
}
