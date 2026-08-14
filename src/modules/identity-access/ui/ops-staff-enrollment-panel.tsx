"use client";

import { useState } from "react";

type Organization = { organization_id: string; organization_name: string };
type InternalRole = "admin" | "commercial" | "concierge" | "finance" | "mentor";

const roles: { value: InternalRole; label: string }[] = [
  { value: "admin", label: "Admin" },
  { value: "commercial", label: "Comercial" },
  { value: "concierge", label: "Concierge" },
  { value: "finance", label: "Financeiro" },
  { value: "mentor", label: "Mentor" },
];

export function OpsStaffEnrollmentPanel({ organizations }: { organizations: Organization[] }) {
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function createStaffAccess(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setPending(true);
    setMessage(null);
    const response = await fetch("/api/ops/enrollments", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.get("email"),
        organizationId: form.get("organizationId"),
        internalRole: form.get("internalRole"),
        membershipRole: "owner",
        validForHours: 72,
      }),
    });
    setPending(false);
    if (!response.ok) {
      setMessage("Não foi possível criar o acesso interno agora. Revise os dados e tente novamente.");
      return;
    }
    event.currentTarget.reset();
    setMessage("Acesso interno criado. A pessoa recebe apenas o código de entrada no próprio login.");
  }

  return <section className="status">
    <p className="eyebrow">Equipe Mesa dos Donos</p>
    <h2>Liberar acesso interno</h2>
    <p className="summary">Cria uma identidade da equipe, um perfil operacional e uma organização de demonstração. Não há senha, link ou cadastro público.</p>
    <form className="auth-form" onSubmit={createStaffAccess}>
      <label htmlFor="staff-email">E-mail da equipe</label>
      <input id="staff-email" name="email" type="email" required />
      <label htmlFor="staff-role">Perfil interno</label>
      <select id="staff-role" name="internalRole" defaultValue="admin">{roles.map((role) => <option key={role.value} value={role.value}>{role.label}</option>)}</select>
      <label htmlFor="staff-demo-organization">Organização para visão de membro</label>
      <select id="staff-demo-organization" name="organizationId" required disabled={organizations.length === 0}>
        {organizations.length === 0 ? <option>Nenhuma organização disponível</option> : organizations.map((organization) => <option key={organization.organization_id} value={organization.organization_id}>{organization.organization_name}</option>)}
      </select>
      <button type="submit" disabled={pending || organizations.length === 0}>{pending ? "Criando…" : "Criar acesso interno"}</button>
    </form>
    {message && <p className="feedback" role="status">{message}</p>}
  </section>;
}
