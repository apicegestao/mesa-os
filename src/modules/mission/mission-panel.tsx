"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { provisionMissions } from "./actions";
import type { Mission } from "./index";

export function MissionPanel({
  cycleId,
  missions,
}: {
  cycleId: string;
  missions: Mission[];
}) {
  const [pending, run] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();
  const available = missions.find((mission) => mission.status === "available");

  if (available) {
    return (
      <section className="priority-card card">
        <p className="eyebrow">Missão 1 de {missions.length}</p>
        <h2>{available.title}</h2>
        <p>{available.objective}</p>
        <p className="feedback">
          <strong>Por que isso importa:</strong> {available.rationale}
        </p>
        <p className="feedback">
          As próximas Missões permanecem protegidas até existir um avanço
          comprovável em um incremento futuro.
        </p>
      </section>
    );
  }

  function handleProvision() {
    setMessage(null);
    run(async () => {
      const result = await provisionMissions(cycleId);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      router.refresh();
    });
  }

  return (
    <section className="priority-card card">
      <p className="eyebrow">Próxima etapa</p>
      <h2>Conhecer a primeira Missão</h2>
      <p>
        A Missão transforma o foco do ciclo em um resultado claro. Ainda não
        cria tarefas, ferramentas ou progresso.
      </p>
      <button disabled={pending} onClick={handleProvision}>
        {pending ? "Preparando…" : "Conhecer primeira Missão"}
      </button>
      {message && <p className="feedback error-text">{message}</p>}
    </section>
  );
}
