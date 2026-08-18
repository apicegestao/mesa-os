import type { TutorIAOrientation } from "./orientation";

/**
 * Stable quality cases for the TutorIA. They contain no member data and are
 * used to keep the teaching standard explicit as prompts evolve.
 */
export const tutorIAQualityScenarios = [
  { id: "dre_iniciante", question: "Não sei fazer uma DRE. Você pode me ajudar?", expected: "Explica o que a DRE mostra, oferece uma estrutura inicial e pede somente o tipo de negócio." },
  { id: "caixa_urgente", question: "Tenho vendas, mas o dinheiro nunca sobra. O que faço?", expected: "Diferencia lucro de caixa, indica o levantamento imediato e evita prometer solução sem números." },
  { id: "papeis_confusos", question: "Tudo depende de mim. Como começo a delegar?", expected: "Propõe uma decisão ou rotina prioritária, um responsável e um limite de autonomia inicial." },
  { id: "vendas_sem_previsibilidade", question: "Minhas vendas oscilam muito. Por onde começo?", expected: "Organiza funil, conversão e próxima ação comercial antes de sugerir expansão." },
  { id: "processo_caotico", question: "Minha equipe faz cada um de um jeito. Como organizar?", expected: "Escolhe um processo crítico, descreve resultado esperado e o primeiro padrão simples." },
  { id: "decisao_dificil", question: "Estou em dúvida se devo contratar agora.", expected: "Separa decisão, evidências necessárias, risco e teste reversível; não decide no lugar do membro." },
] as const;

export const tutorIATeachingStandard = [
  "Responda a pergunta antes de explicar a metodologia.",
  "Use palavras do dia a dia e defina qualquer termo técnico na primeira vez.",
  "Dê uma ação que caiba hoje, seguida de no máximo três passos curtos.",
  "Diga qual dado observar e como ele muda a decisão.",
  "Quando faltar informação, faça somente a pergunta que destrava o próximo passo.",
] as const;

const humanHandoffLanguage = /apoio humano|falar com a equipe|encaminh[ae]|especialista humano|revisão humana/i;
const genericDeflection = /preciso de mais contexto|não consigo ajudar|não posso orientar/i;

/** A lightweight guardrail for model output. It does not judge management
 * correctness; it rejects only clearly unhelpful or off-model responses. */
export function meetsTutorIAQualityStandard(orientation: TutorIAOrientation) {
  const combined = `${orientation.resumo} ${orientation.proxima_acao} ${orientation.justificativa_metodologica}`;
  return orientation.resumo.length <= 260
    && orientation.proxima_acao.length <= 220
    && orientation.justificativa_metodologica.length <= 240
    && !humanHandoffLanguage.test(combined)
    && !genericDeflection.test(combined)
    && orientation.proxima_acao.split(/\s+/).length >= 7;
}
