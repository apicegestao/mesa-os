"use client";

import { useState } from "react";

type Enrollment = {
  created_at: string;
  email: string;
  expires_at: string;
  id: string;
  organization_id: string;
  role: "owner" | "member";
  status: "pending" | "provisioned" | "revoked" | "expired";
};

export function OpsEnrollmentPanel({ initialEnrollments }: { initialEnrollments: Enrollment[] }) {
  const [enrollments, setEnrollments] = useState(initialEnrollments);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [revokingId, setRevokingId] = useState<string | null>(null);

  async function createEnrollment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setMessage(null);
    const response = await fetch("/api/ops/enrollments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"), organizationId: form.get("organizationId"), role: form.get("role"), validForHours: Number(form.get("validForHours")),
      }),
    });
    setPending(false);
    if (!response.ok) {
      setMessage("Não foi possível concluir a liberação. Revise os dados e tente novamente.");
      return;
    }
    event.currentTarget.reset();
    setMessage("Acesso liberado. A pessoa já pode solicitar o código de entrada.");
  }

  async function revokeEnrollment(enrollmentId: string) {
    setRevokingId(enrollmentId);
    setMessage(null);
    const response = await fetch("/api/ops/enrollments", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ enrollmentId }),
    });
    setRevokingId(null);
    if (!response.ok) {
      setMessage("Não foi possível revogar esta autorização agora.");
      return;
    }
    setEnrollments((current) => current.map((entry) => entry.id === enrollmentId ? { ...entry, status: "revoked" } : entry));
    setMessage("Autorização revogada e registrada na auditoria.");
  }

  return <section className="status"><p className="eyebrow">Operação controlada</p><h2>Liberar acesso de membro</h2><p className="summary">Esta área somente cria ou revoga matrículas autorizadas. Não exibe dados de negócio dos membros.</p><form className="auth-form" onSubmit={createEnrollment}>
    <label htmlFor="member-email">E-mail do membro</label><input id="member-email" name="email" type="email" required />
    <label htmlFor="organization-id">ID da organização</label><input id="organization-id" name="organizationId" required />
    <label htmlFor="member-role">Perfil de acesso</label><select id="member-role" name="role" defaultValue="owner"><option value="owner">Dono</option><option value="member">Membro</option></select>
    <label htmlFor="valid-hours">Validade da autorização (horas)</label><input id="valid-hours" name="validForHours" type="number" min="1" max="168" defaultValue="72" required />
    <button type="submit" disabled={pending}>{pending ? "Liberando…" : "Liberar acesso"}</button>
  </form>{message && <p className="feedback" role="status">{message}</p>}
  {enrollments.length > 0 && <section className="ops-enrollment-list" aria-label="Autorizações criadas por você"><h3>Autorizações criadas por você</h3><p className="feedback">O código é solicitado pelo próprio membro no login; não há convite ou link para reenviar.</p>{enrollments.map((entry) => <article key={entry.id}><p><strong>{entry.email}</strong> · {entry.role} · {entry.status}</p>{entry.status === "pending" && <button type="button" className="button-quiet" onClick={() => void revokeEnrollment(entry.id)} disabled={revokingId === entry.id}>{revokingId === entry.id ? "Revogando…" : "Revogar autorização"}</button>}</article>)}</section>}
  </section>;
}
