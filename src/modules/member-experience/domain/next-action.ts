export type MemberJourneyState = {
  diagnosticStatus: "draft" | "completed";
  hasPriority: boolean;
  priorityTied: boolean;
  hasCycle: boolean;
  hasMissions: boolean;
  hasAvailableMission: boolean;
  hasToolDraft: boolean;
  implementationStatus: "none" | "draft" | "implemented";
};

export type NextAction = {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  label: string;
};

export function deriveNextAction(state: MemberJourneyState): NextAction {
  if (state.diagnosticStatus === "draft") return { eyebrow: "Seu ponto de partida", title: "Continue o Raio-X", description: "Conclua o diagnóstico para que sua prioridade possa ser definida com base na realidade da empresa.", href: "#diagnostico", label: "Continuar diagnóstico" };
  if (!state.hasPriority && state.priorityTied) return { eyebrow: "Direção do ciclo", title: "TutorIA está definindo o ponto de partida", description: "O Raio-X encontrou prioridades equivalentes e aplicará a regra metodológica automaticamente.", href: "#prioridade", label: "Ver direção" };
  if (!state.hasPriority) return { eyebrow: "Direção do ciclo", title: "TutorIA está preparando seu foco", description: "O Raio-X transforma a menor dimensão em uma direção objetiva para o primeiro ciclo.", href: "#prioridade", label: "Ver direção" };
  if (!state.hasCycle) return { eyebrow: "Sua prioridade agora", title: "Inicie o ciclo de 90 dias", description: "Transforme a prioridade confirmada em um período claro de foco e execução.", href: "#ciclo", label: "Iniciar ciclo" };
  if (!state.hasMissions) return { eyebrow: "Próximo passo", title: "Conheça sua primeira Missão", description: "A Missão traduz o foco do ciclo em uma mudança empresarial concreta.", href: "#missao", label: "Abrir Missão" };
  if (!state.hasAvailableMission) return { eyebrow: "Ciclo em andamento", title: "Revise sua jornada", description: "As Missões disponíveis neste momento já foram percorridas. Consulte o estado atual do ciclo.", href: "#jornada", label: "Ver jornada" };
  if (!state.hasToolDraft) return { eyebrow: "Sua prioridade agora", title: "Construa a ferramenta da Missão", description: "Estruture papéis e decisões antes de levar a mudança para a operação da empresa.", href: "#workspace", label: "Começar ferramenta" };
  if (state.implementationStatus !== "implemented") return { eyebrow: "Sua prioridade agora", title: "Coloque a ferramenta em prática", description: "Registre como o que foi construído passou a ser usado de verdade na empresa.", href: "#implementacao", label: "Registrar implementação" };
  return { eyebrow: "Sua prioridade agora", title: "Comprove o avanço", description: "Registre um fato observável para concluir a Missão e liberar o próximo passo.", href: "#implementacao", label: "Registrar evidência" };
}
