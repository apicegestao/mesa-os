"use client";

import { useState } from "react";
import type { CrmOpportunity, InternalRole } from "@/modules/crm/domain";

type Workspace = { offers: { id: string; code: string; name: string; price_version_id: string; amount: number; currency_code: string }[]; proposals: { id: string; status: string; amount: number; currency_code: string; expires_on: string | null; opportunity_title: string; account_name: string }[] };

export function OpsFinanceConsole({ opportunities, roles, workspace }: { opportunities: CrmOpportunity[]; roles: InternalRole[]; workspace: Workspace }) {
  const [message, setMessage] = useState<string | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const canManage = roles.includes("admin") || roles.includes("finance");
  const canPropose = canManage || roles.includes("commercial");

  async function reissueCardCheckout(proposalId: string) {
    setPending(true); setMessage(null); setCheckoutUrl(null);
    try {
      const response = await fetch("/api/ops/finance/checkout/reissue", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ proposalId }) });
      const payload = await response.json().catch(() => null) as { checkoutUrl?: string } | null;
      if (!response.ok || !payload?.checkoutUrl) throw new Error("reissue_failed");
      setCheckoutUrl(payload.checkoutUrl);
      setMessage("Checkout anterior cancelado e novo checkout em cartão criado. O acesso continua pendente até a confirmação do provedor.");
    } catch { setMessage("Não foi possível reemitir o checkout em cartão. Nenhum acesso foi liberado."); } finally { setPending(false); }
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formNode = event.currentTarget;
    const form = new FormData(formNode);
    setPending(true); setMessage(null);
    try {
      const action = String(form.get("action"));
      const payload = action === "createOffer"
        ? { action, code: form.get("code"), name: form.get("name"), amount: form.get("amount"), currency: "BRL" }
        : action === "createProposal"
          ? { action, opportunityId: form.get("opportunityId"), priceVersionId: form.get("priceVersionId"), expiresOn: form.get("expiresOn") || null }
          : { action, proposalId: form.get("proposalId"), dueOn: form.get("dueOn") || null, methodLabel: form.get("methodLabel") || null, externalReference: form.get("externalReference") || null };
      const response = await fetch("/api/ops/finance", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error("request_failed");
      setMessage(action === "confirmPayment" ? "Confirmação externa registrada e auditada. Revise a elegibilidade antes de comunicar o acesso." : "Registro financeiro realizado e auditado. Atualize a página para consultar o estado consolidado.");
      formNode.reset();
    } catch { setMessage("Não foi possível concluir esta operação financeira."); } finally { setPending(false); }
  }

  async function createCheckout(proposalId: string) {
    setPending(true); setMessage(null); setCheckoutUrl(null);
    try {
      const response = await fetch("/api/ops/finance/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ proposalId }) });
      const payload = await response.json().catch(() => null) as { checkoutUrl?: string; reason?: string; providerCodes?: string[]; providerFields?: string[]; providerMessage?: string | null } | null;
      if (!response.ok || !payload?.checkoutUrl) {
        const providerCodes = payload?.providerCodes?.filter((code) => /^[a-z0-9_]{1,80}$/.test(code)) ?? [];
        const providerFields = payload?.providerFields?.filter((field) => /^(billingTypes|chargeTypes|minutesToExpire|externalReference|callback|items|customerData)$/.test(field)) ?? [];
        const providerMessage = payload?.providerMessage && /^[\p{L}\p{N} .,:;_'-]{1,240}$/u.test(payload.providerMessage) ? payload.providerMessage : null;
        const detail = [...providerCodes, ...providerFields].join(", ");
        const error = response.status === 403 ? "O checkout Sandbox só pode ser criado na homologação." : response.status === 503 ? payload?.reason === "provider_unavailable" ? "Não foi possível verificar a configuração Pix no Asaas Sandbox." : "A chave Sandbox não está disponível neste preview." : response.status === 409 ? "Já existe uma tentativa de checkout em andamento." : payload?.reason === "pix_key_required" ? "Cadastre uma chave Pix ativa na conta Asaas Sandbox antes de gerar checkout." : payload?.reason === "permission" ? "Sua função atual não pode criar checkout Sandbox." : payload?.reason === "contact" ? "O contato principal precisa ter nome e e-mail válidos." : payload?.reason === "provider_rejected" ? `O Asaas Sandbox recusou o formato do checkout${detail ? ` (${detail})` : ""}${providerMessage ? `: ${providerMessage}` : ""}. Nenhuma cobrança foi criada.` : "Não foi possível preparar o checkout. Confirme o contato principal e a configuração Sandbox.";
        throw new Error(error);
      }
      setCheckoutUrl(payload.checkoutUrl);
      setMessage("Checkout Sandbox criado. O acesso continua pendente até a confirmação do webhook do Asaas.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "Não foi possível criar o checkout agora."); } finally { setPending(false); }
  }

  if (!canPropose) return null;
  return <section className="ops-finance">
    <header><p className="eyebrow">Receita e acesso</p><h2>Propostas e elegibilidade</h2><p className="summary">O checkout do Asaas é hospedado pelo provedor. O acesso é preparado somente após confirmação recebida pelo webhook; retornar da página de pagamento não libera o sistema.</p></header>
    {canManage && <details><summary>+ Nova oferta e preço</summary><form className="auth-form" onSubmit={submit}><input type="hidden" name="action" value="createOffer" /><label>Código<input name="code" placeholder="mesa-anual" required /></label><label>Oferta<input name="name" required /></label><label>Preço (BRL)<input name="amount" type="number" min="0" step="0.01" required /></label><button disabled={pending}>Criar oferta</button></form></details>}
    <details><summary>+ Nova proposta</summary><form className="auth-form" onSubmit={submit}><input type="hidden" name="action" value="createProposal" /><label>Oportunidade<select name="opportunityId" required>{opportunities.map((opportunity) => <option key={opportunity.id} value={opportunity.id}>{opportunity.account_name} · {opportunity.title}</option>)}</select></label><label>Oferta / preço<select name="priceVersionId" required>{workspace.offers.map((offer) => <option key={offer.price_version_id} value={offer.price_version_id}>{offer.name} · {new Intl.NumberFormat("pt-BR", { style: "currency", currency: offer.currency_code }).format(offer.amount)}</option>)}</select></label><label>Validade<input name="expiresOn" type="date" /></label><button disabled={pending || !workspace.offers.length || !opportunities.length}>Criar proposta</button></form></details>
    <section className="ops-finance-list"><h3>Propostas da sua função</h3>{workspace.proposals.length ? <ul>{workspace.proposals.map((proposal) => <li key={proposal.id}><strong>{proposal.account_name}</strong> · {proposal.opportunity_title}<br />{new Intl.NumberFormat("pt-BR", { style: "currency", currency: proposal.currency_code }).format(proposal.amount)} · {proposal.status}{canManage && <div className="ops-finance-actions"><button className="button-quiet" disabled={pending} type="button" onClick={() => void createCheckout(proposal.id)}>Gerar checkout Sandbox</button><button className="button-quiet" disabled={pending} type="button" onClick={() => void reissueCardCheckout(proposal.id)}>Reemitir em cartão</button><details><summary>Registrar confirmação externa</summary><p className="section-intro">Use somente quando o pagamento tiver sido conferido fora do Asaas. Esta ação é auditada e não substitui o webhook.</p><form className="auth-form" onSubmit={submit}><input type="hidden" name="action" value="confirmPayment" /><input type="hidden" name="proposalId" value={proposal.id} /><label>Vencimento<input name="dueOn" type="date" /></label><label>Método (sem dados sensíveis)<input name="methodLabel" maxLength={80} placeholder="Ex.: confirmação manual" /></label><label>Referência externa (opcional)<input name="externalReference" maxLength={160} /></label><button className="button-quiet" disabled={pending}>Registrar confirmação</button></form></details></div>}</li>)}</ul> : <p className="feedback">Nenhuma proposta disponível.</p>}</section>
    {message && <p className="feedback" role="status">{message}</p>}
    {checkoutUrl && <p className="feedback"><a href={checkoutUrl} rel="noreferrer" target="_blank">Abrir checkout Sandbox</a></p>}
  </section>;
}
