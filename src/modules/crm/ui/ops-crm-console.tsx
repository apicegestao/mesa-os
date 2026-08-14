"use client";

import { useState } from "react";
import type { CrmWorkspace, InternalRole } from "../domain";

type Operator = { email: string; identity_id: string; roles: InternalRole[] };

export function OpsCrmConsole({ initialWorkspace, isBootstrap, operators, roles }: { initialWorkspace: CrmWorkspace; isBootstrap: boolean; operators: Operator[]; roles: InternalRole[] }) {
  const [workspace, setWorkspace] = useState(initialWorkspace);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function request(path: string, body: object) {
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    if (!response.ok) throw new Error("request_failed");
    return response.json() as Promise<unknown>;
  }

  async function bootstrap() {
    setPending(true); setMessage(null);
    try { await request("/api/ops/roles", { action: "bootstrap" }); window.location.reload(); }
    catch { setMessage("Não foi possível iniciar a administração interna agora."); }
    finally { setPending(false); }
  }

  async function assignRole(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setPending(true); setMessage(null);
    try { await request("/api/ops/roles", { action: "assign", identityId: form.get("identityId"), role: form.get("role") }); setMessage("Função interna atribuída e auditada."); window.location.reload(); }
    catch { setMessage("Não foi possível atribuir esta função."); }
    finally { setPending(false); }
  }

  async function createOpportunity(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); const form = new FormData(event.currentTarget); setPending(true); setMessage(null);
    try {
      await request("/api/ops/crm/opportunities", {
        accountName: form.get("accountName"), source: form.get("source"), contactName: form.get("contactName"), contactEmail: form.get("contactEmail"),
        title: form.get("title"), expectedValue: form.get("expectedValue") || null, nextAction: form.get("nextAction"), nextActionDueOn: form.get("nextActionDueOn") || null,
      });
      setMessage("Oportunidade registrada. Atualize a página para consultar a carteira consolidada."); event.currentTarget.reset();
    } catch { setMessage("Não foi possível registrar a oportunidade."); }
    finally { setPending(false); }
  }

  async function acceptHandoff(id: string) {
    setPending(true); setMessage(null);
    try { await request("/api/ops/crm/handoffs", { handoffId: id }); setWorkspace((current) => ({ ...current, handoffs: current.handoffs.map((handoff) => handoff.id === id ? { ...handoff, status: "accepted" } : handoff) })); setMessage("Handoff aceito. A matrícula permanece uma ação controlada."); }
    catch { setMessage("Não foi possível aceitar este handoff."); }
    finally { setPending(false); }
  }

  if (isBootstrap) return <section className="status"><p className="eyebrow">Operação controlada</p><h1>Ativar administração interna</h1><p className="summary">Sua identidade já é interna. Esta ação única cria a primeira função Admin e mantém todas as atribuições futuras auditadas.</p><button type="button" onClick={() => void bootstrap()} disabled={pending}>{pending ? "Ativando…" : "Ativar administração"}</button>{message && <p className="feedback" role="status">{message}</p>}</section>;

  const canCreate = roles.includes("admin") || roles.includes("commercial");
  const canManageRoles = roles.includes("admin");
  const canAcceptHandoffs = roles.includes("admin") || roles.includes("concierge");

  return <section className="ops-console"><header><p className="eyebrow">Backoffice Mesa dos Donos</p><h1>Relacionamento e entrada</h1><p className="summary">CRM comercial e handoff controlado. Não exibe contexto metodológico, conversas ou evolução de membros.</p></header>
    {canManageRoles && <section className="status"><h2>Funções da equipe</h2><form className="auth-form" onSubmit={assignRole}><label htmlFor="internal-person">Pessoa interna</label><select id="internal-person" name="identityId" required>{operators.map((operator) => <option key={operator.identity_id} value={operator.identity_id}>{operator.email}{operator.roles.length ? ` · ${operator.roles.join(", ")}` : " · sem função"}</option>)}</select><label htmlFor="internal-role">Função</label><select id="internal-role" name="role" defaultValue="commercial"><option value="commercial">Comercial</option><option value="concierge">Concierge</option><option value="admin">Admin</option></select><button type="submit" disabled={pending}>Atribuir função</button></form></section>}
    {canCreate && <section className="status"><h2>Nova oportunidade</h2><form className="auth-form" onSubmit={createOpportunity}><label htmlFor="account-name">Empresa</label><input id="account-name" name="accountName" required maxLength={180} /><label htmlFor="contact-name">Contato</label><input id="contact-name" name="contactName" maxLength={180} /><label htmlFor="contact-email">E-mail do contato</label><input id="contact-email" name="contactEmail" type="email" maxLength={254} /><label htmlFor="opportunity-title">Oportunidade</label><input id="opportunity-title" name="title" required maxLength={180} /><label htmlFor="source">Origem</label><input id="source" name="source" defaultValue="manual" maxLength={80} /><label htmlFor="next-action">Próxima ação</label><input id="next-action" name="nextAction" required maxLength={500} /><label htmlFor="next-action-due">Data da próxima ação</label><input id="next-action-due" name="nextActionDueOn" type="date" /><label htmlFor="expected-value">Valor estimado (opcional)</label><input id="expected-value" name="expectedValue" type="number" min="0" step="0.01" /><button type="submit" disabled={pending}>{pending ? "Registrando…" : "Registrar oportunidade"}</button></form></section>}
    <section className="status"><h2>Minha carteira</h2>{workspace.opportunities.length ? <ul>{workspace.opportunities.map((opportunity) => <li key={opportunity.id}><strong>{opportunity.title}</strong> · {opportunity.account_name}<br /><span>{opportunity.stage} · Próxima ação: {opportunity.next_action}</span></li>)}</ul> : <p className="feedback">Nenhuma oportunidade disponível para sua função.</p>}</section>
    <section className="status"><h2>Handoffs de onboarding</h2>{workspace.handoffs.length ? <ul>{workspace.handoffs.map((handoff) => <li key={handoff.id}><strong>{handoff.opportunity_title}</strong> · {handoff.account_name}<br /><span>{handoff.status}</span>{canAcceptHandoffs && handoff.status === "pending" && <><br /><button type="button" className="button-quiet" onClick={() => void acceptHandoff(handoff.id)} disabled={pending}>Aceitar handoff</button></>}</li>)}</ul> : <p className="feedback">Nenhum handoff disponível para sua função.</p>}</section>
    {message && <p className="feedback" role="status">{message}</p>}
  </section>;
}
