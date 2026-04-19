export const COPY = {
  empty: {
    transactions: "Silêncio no fluxo. Registre o primeiro movimento ou conecte uma conta.",
    inbox: "Inbox em silêncio. Solte um comprovante — a IA faz o resto.",
    goals: "Ainda sem rotas traçadas. Comece com uma reserva de emergência.",
    categories: "Nenhuma categoria ainda. Aplique a taxonomia padrão para começar.",
    uncategorized: "Tudo em ordem. Nada aguarda revisão.",
    adviser: "O Adviser está online. Pergunte algo — ou espere o próximo sinal.",
    recommendations: "Nenhum sinal crítico. O reino está em ordem.",
  },
  actions: {
    confirm: "Confirmar",
    approve: "Aprovar",
    dismiss: "Descartar",
    review: "Revisar",
    adjust: "Ajustar",
    later: "Depois",
    undo: "Desfazer",
    apply: "Aplicar",
    applyAll: "Aplicar em lote",
    createRule: "Criar regra para futuros",
  },
  health: {
    high: "Saúde em alta. Comando estável.",
    medium: "Atenção merecida. Alguns pontos exigem revisão.",
    low: "Recuo necessário. O fluxo pede revisão.",
  },
  loading: {
    generic: "Organizando o fluxo…",
    sync: "Buscando movimentos…",
    ai: "Lendo padrões…",
  },
  errors: {
    network: "Conexão instável. Tentando novamente.",
    bankExpired: "Conexão com o banco expirou. Reautenticar.",
    aiLow: "Não consegui sugerir. Categorize manualmente e aprendo com você.",
    permission: "Sem permissão para esta ação. Fale com o administrador.",
  },
} as const;
