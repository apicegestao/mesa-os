import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MethodologyMap } from "./methodology-map";
import { TutoriaPresence } from "./tutoria-presence";

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
});
