import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MethodologyMap } from "./methodology-map";
import { TutoriaPresence } from "./tutoria-presence";
import { JourneyProgress } from "./journey-progress";
import { MentorNote } from "./mentor-note";
import { MemberHome } from "./member-home";
import { EvolutionProjection } from "./evolution-projection";
import { EvidenceOverview } from "./evidence-overview";
import { JourneyDeliveries } from "./journey-deliveries";
import { DiagnosticsOverview } from "./diagnostics-overview";

describe("member experience foundations", () => {
  it("presents TutorIA honestly without an interactive fake capability", () => {
    render(<TutoriaPresence />);
    expect(screen.getByRole("heading", { name: "Orientação dentro da sua jornada" })).toBeInTheDocument();
    expect(screen.getByText(/conversa inteligente ainda não está ativada/i)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("labels the 4x4 map as methodology rather than personal progress", () => {
    render(<MethodologyMap />);
    expect(screen.getByRole("heading", { name: "O que evolui em cada trimestre" })).toBeInTheDocument();
    expect(screen.getByText("DRE e painel mínimo")).toBeInTheDocument();
    expect(screen.getByText(/não representa seu progresso individual/i)).toBeInTheDocument();
  });

  it("shows progress only from supplied canonical steps", () => {
    render(<JourneyProgress steps={[{ label: "Diagnóstico", complete: true, tone: "blue" }, { label: "Ciclo", complete: false, tone: "gold" }]} />);
    expect(screen.getByText("1 de 2 etapas")).toBeInTheDocument();
    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("restores Lula guidance without inventing an external destination", () => {
    render(<MentorNote />);
    expect(screen.getByText("Direção do Lula")).toBeInTheDocument();
    expect(screen.getByText(/o trimestre não termina/i)).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("composes Hoje from canonical state without inventing missing metrics", () => {
    render(<MemberHome memberName="Rafael Portela" nextAction={{ eyebrow: "Seu ponto de partida", title: "Continue o Raio-X", description: "Conclua o diagnóstico.", href: "#diagnostico", label: "Continuar diagnóstico" }} cycle={null} completedSteps={0} totalSteps={8} />);
    expect(screen.getByRole("heading", { name: "Bom dia, Rafael." })).toBeInTheDocument();
    expect(screen.getAllByText("0 de 8 etapas")).toHaveLength(2);
    expect(screen.getByText("Ainda não medido")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Pedir ajuda à TutorIA" })).toBeDisabled();
  });

  it("supports multiple real pending actions while preserving their order", () => {
    const primary = { eyebrow: "Agora", title: "Concluir diagnóstico", description: "Finalize o Raio-X.", href: "#diagnostico", label: "Continuar" };
    const secondary = { eyebrow: "Depois", title: "Revisar ciclo", description: "Confira o período.", href: "#ciclo", label: "Revisar" };
    render(<MemberHome memberName="Rafael" nextAction={primary} additionalActions={[secondary]} cycle={null} completedSteps={0} totalSteps={8} />);
    expect(screen.getByText("2 pendências")).toBeInTheDocument();
    expect(screen.getByText("Concluir diagnóstico")).toBeInTheDocument();
    expect(screen.getByText("Revisar ciclo")).toBeInTheDocument();
  });

  it("keeps evolution honest until a valid comparison exists", () => {
    render(<EvolutionProjection diagnosticComplete={false} completedSteps={0} totalSteps={8} evidenceSubmitted={false} />);
    expect(screen.getByRole("heading", { name: "Evolução da empresa" })).toBeInTheDocument();
    expect(screen.getByText("aguardando Raio-X")).toBeInTheDocument();
    expect(screen.getByText("Sem comparação longitudinal")).toBeInTheDocument();
    expect(screen.getByText("Nenhum marco comprovado")).toBeInTheDocument();
  });

  it("does not invent evidence approval states", () => {
    render(<EvidenceOverview implementation={null} evidenceSubmitted={false} />);
    expect(screen.getByRole("heading", { name: "Evidências" })).toBeInTheDocument();
    expect(screen.getByText("Nenhuma evidência registrada ainda")).toBeInTheDocument();
    expect(screen.queryByText("Aprovada")).not.toBeInTheDocument();
  });

  it("summarizes only the canonical journey deliveries", () => {
    render(<JourneyDeliveries missions={[{ id: "mission-1", definition_id: "definition-1", position: 1, title: "Clareza de papéis", objective: "Definir responsabilidades essenciais.", rationale: "Reduz dependência.", status: "available", completed_at: null }]} availableMissionId="mission-1" toolStarted implementationStatus="draft" evidenceSubmitted={false} />);
    expect(screen.getByRole("heading", { name: "Entregas em implementação" })).toBeInTheDocument();
    expect(screen.getByText("Em implementação")).toBeInTheDocument();
    expect(screen.getByText("Clareza de papéis")).toBeInTheDocument();
  });

  it("shows diagnostic trajectory without scheduling unauthorized reanalysis", () => {
    render(<DiagnosticsOverview workspace={{ revisionId: "revision-1", executionId: null, status: "not_started", answers: {}, options: [], result: null, dimensions: [{ id: "dimension-1", code: "finance", label: "Financeiro", position: 1, questions: [] }] }} diagnosticContent={<p>Formulário</p>} />);
    expect(screen.getByRole("heading", { name: "Diagnósticos" })).toBeInTheDocument();
    expect(screen.getByText("Financeiro")).toBeInTheDocument();
    expect(screen.getAllByText("Aguardando autorização metodológica.")).toHaveLength(3);
    expect(screen.queryByText(/abre em \d+ dias/i)).not.toBeInTheDocument();
  });
});
