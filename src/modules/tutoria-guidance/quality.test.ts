import { describe, expect, it } from "vitest";
import { meetsTutorIAQualityStandard, tutorIAQualityScenarios, tutorIATeachingStandard } from "./quality";

describe("TutorIA teaching quality contract", () => {
  const clearAnswer = {
    resumo: "Comece pelo resultado que você quer destravar agora.",
    proxima_acao: "1. Escolha uma rotina crítica. 2. Registre como ela acontece hoje. 3. Defina o responsável pelo próximo teste.",
    justificativa_metodologica: "Assim você troca urgência por uma decisão observável e melhora uma coisa de cada vez.",
    confidence_band: "high" as const,
    escalation_required: false,
  };

  it("covers the core doubts an entrepreneur brings to the TutorIA", () => {
    expect(tutorIAQualityScenarios.map((scenario) => scenario.id)).toEqual(expect.arrayContaining(["dre_iniciante", "caixa_urgente", "papeis_confusos", "vendas_sem_previsibilidade", "processo_caotico", "decisao_dificil"]));
    expect(tutorIATeachingStandard).toHaveLength(5);
  });

  it("accepts concise, practical teaching and rejects a human handoff", () => {
    expect(meetsTutorIAQualityStandard(clearAnswer)).toBe(true);
    expect(meetsTutorIAQualityStandard({ ...clearAnswer, resumo: "Vou encaminhar você para apoio humano." })).toBe(false);
    expect(meetsTutorIAQualityStandard({ ...clearAnswer, proxima_acao: "Preciso de mais contexto." })).toBe(false);
  });
});
