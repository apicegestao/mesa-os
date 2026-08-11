import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MethodologyMap } from "./methodology-map";
import { TutoriaPresence } from "./tutoria-presence";
import { JourneyProgress } from "./journey-progress";
import { MentorNote } from "./mentor-note";
import { MemberHome } from "./member-home";
import { EvolutionProjection } from "./evolution-projection";

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

  it("keeps evolution honest until a valid comparison exists", () => {
    render(<EvolutionProjection diagnosticComplete={false} completedSteps={0} totalSteps={8} evidenceSubmitted={false} />);
    expect(screen.getByRole("heading", { name: "O que mudou na gestão" })).toBeInTheDocument();
    expect(screen.getByText("Em construção")).toBeInTheDocument();
    expect(screen.getByText(/comparação será liberada somente/i)).toBeInTheDocument();
    expect(screen.getByText("Nenhuma evidência ainda")).toBeInTheDocument();
  });
});
