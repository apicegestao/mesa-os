"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startCycle } from "./actions";
import type { Cycle } from "./index";

function formatDate(value: string) {
  return new Date(`${value}T12:00:00`).toLocaleDateString("pt-BR");
}

export function CyclePanel({
  priorityId,
  cycle,
}: {
  priorityId: string;
  cycle: Cycle | null;
}) {
  const [pending, run] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  if (cycle) {
    return (
      <section className="priority-card card">
        <p className="eyebrow">Ciclo ativo</p>
        <h2>{cycle.title}</h2>
        <p>
          <strong>{formatDate(cycle.starts_on)}</strong> até{" "}
          <strong>{formatDate(cycle.ends_on)}</strong>
        </p>
        <p className="feedback">
          90 dias de foco na prioridade confirmada.
        </p>
      </section>
    );
  }

  function handleStart() {
    setMessage(null);
    run(async () => {
      const result = await startCycle(priorityId);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <section className="priority-card card">
      <p className="eyebrow">Sua próxima ação</p>
      <h2>Iniciar ciclo de 90 dias</h2>
      <p>
        Ative o período de foco definido pelo Raio-X. A primeira Missão será
        liberada imediatamente para você saber exatamente como começar.
      </p>
      <button disabled={pending} onClick={handleStart}>
        {pending ? "Preparando sua jornada…" : "Ativar ciclo e primeira Missão"}
      </button>
      {message && <p className="feedback error-text">{message}</p>}
    </section>
  );
}
