"use client";

import { useState } from "react";

export function OpsEnrollmentPanel() {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

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

  return <section className="status"><p className="eyebrow">Operação controlada</p><h2>Liberar acesso de membro</h2><p className="summary">Esta área somente cria ou revoga matrículas autorizadas. Não exibe dados de negócio dos membros.</p><form className="auth-form" onSubmit={createEnrollment}>
    <label htmlFor="member-email">E-mail do membro</label><input id="member-email" name="email" type="email" required />
    <label htmlFor="organization-id">ID da organização</label><input id="organization-id" name="organizationId" required />
    <label htmlFor="member-role">Perfil de acesso</label><select id="member-role" name="role" defaultValue="owner"><option value="owner">Dono</option><option value="member">Membro</option></select>
    <label htmlFor="valid-hours">Validade da autorização (horas)</label><input id="valid-hours" name="validForHours" type="number" min="1" max="168" defaultValue="72" required />
    <button type="submit" disabled={pending}>{pending ? "Liberando…" : "Liberar acesso"}</button>
  </form>{message && <p className="feedback" role="status">{message}</p>}
  </section>;
}
