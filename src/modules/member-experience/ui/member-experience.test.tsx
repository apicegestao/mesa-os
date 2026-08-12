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
  it("presents TutorIA as a governed assisted capability", () => {
    render(<TutoriaPresence />);
    expect(screen.getByRole("heading", { name: "Orientação dentro da sua jornada" })).toBeInTheDocument();
    expect(screen.getByText(/protegida por orçamento/i)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });

  it("labels the 4x4 map as methodology rather than personal progress", () => {
    render(<MethodologyMap map={{
      stages: [{ id: "t1", code: "t1", label: "Fundamentos", position: 1 }, { id: "t2", code: "t2", label: "Controle", position: 2 }, { id: "t3", code: "t3", label: "Previsibilidade", position: 3 }, { id: "t4", code: "t4", label: "Autonomia", position: 4 }],
      pillars: [{ id: "finance", code: "finance", label: "Financeiro e indicadores", position: 1, outcomes: [{ id: "dre", stageId: "t1", title: "DRE e painel mínimo" }] }],
    }} />);
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
    expect(screen.getByText("Atual ainda não medido")).toBeInTheDocument();
    expect(screen.getByText("Ainda não medido")).toBeInTheDocument();
    expect(screen.getAllByText("Protegida").length).toBeGreaterThan(0);
    expect(screen.getByText("Nenhum marco comprovado")).toBeInTheDocument();
  });

  it("projects only validated measurements supplied by the measurement backbone", () => {
    render(<EvolutionProjection diagnosticComplete completedSteps={3} totalSteps={8} evidenceSubmitted measurements={{ ime: { value: 52, effectiveOn: "2026-08-11" }, imeHistory: [{ value: 38, effectiveOn: "2026-07-01" }, { value: 52, effectiveOn: "2026-08-11" }], ownerOperationalHours: { value: 5, effectiveOn: "2026-08-11" }, ownerDecisionConcentration: { value: 17, effectiveOn: "2026-08-11" }, dimensionComparison: [{ code: "finance", label: "Financeiro", baseline: 38, current: 52, effectiveOn: "2026-08-11" }] }} />);
    expect(screen.getByText("52")).toBeInTheDocument();
    expect(screen.getByText(/5h\/semana do dono/i)).toBeInTheDocument();
    expect(screen.getByText(/17% de decisões/i)).toBeInTheDocument();
    expect(screen.getByText("IME 38")).toBeInTheDocument();
    expect(screen.getByText("IME 52")).toBeInTheDocument();
    expect(screen.getByText("Entrada 38 · Atual 52")).toBeInTheDocument();
  });

  it("does not invent evidence approval states", () => {
    render(<EvidenceOverview implementation={null} evidenceSubmitted={false} />);
    expect(screen.getByRole("heading", { name: "Evidências" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Provas por pilar" })).toBeInTheDocument();
    expect(screen.getByText("Em revisão")).toBeInTheDocument();
    expect(screen.getByText("Para corrigir")).toBeInTheDocument();
    expect(screen.getByText("Nenhuma evidência registrada ainda")).toBeInTheDocument();
    expect(screen.queryByText("Aprovada")).not.toBeInTheDocument();
  });

  it("renders each canonical evidence status without collapsing the history", () => {
    render(<EvidenceOverview implementation={null} evidenceSubmitted records={[
      { id: "evidence-1", missionTitle: "DRE gerencial", status: "approved", reviewerKind: "tutoria", description: "DRE foi utilizado na reunião semanal de gestão.", occurredOn: "2026-08-11" },
      { id: "evidence-2", missionTitle: "Ritual de liderança", status: "changes_requested", reviewerKind: "human", description: "Registro enviado sem a ata da reunião de liderança.", occurredOn: "2026-08-10" },
    ]} />);
    expect(screen.getByText("DRE gerencial")).toBeInTheDocument();
    expect(screen.getByText("Ritual de liderança")).toBeInTheDocument();
    expect(screen.getByText("Aprovada")).toBeInTheDocument();
    expect(screen.getByText("Correção solicitada")).toBeInTheDocument();
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
    expect(screen.getByRole("heading", { name: "Momentos de reanálise" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "O que será medido" })).toBeInTheDocument();
    expect(screen.getByText("Pulso de maturidade nos quatro pilares")).toBeInTheDocument();
    expect(screen.getByText("Prioridade estratégica declarada pelo membro")).toBeInTheDocument();
    expect(screen.getAllByText("Aguardando autorização metodológica.")).toHaveLength(3);
    expect(screen.queryByText(/abre em \d+ dias/i)).not.toBeInTheDocument();
  });
});
