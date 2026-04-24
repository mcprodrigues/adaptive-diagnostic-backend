export interface LevelSeed {
  level_index: number;
  name: string;
  description: string;
}

export const LEVELS_SEEDS: LevelSeed[] = [
  {
    level_index: 1,
    name: 'Ideação',
    description:
      'A startup possui uma hipótese clara de problema, equipe fundadora definida, proposta de valor escrita e entendimento inicial do mercado e da concorrência.',
  },
  {
    level_index: 2,
    name: 'Descoberta',
    description:
      'Processo estruturado de descoberta de cliente: entrevistas exploratórias em volume, jobs-to-be-done identificados, personas validadas com dados reais e problema quantificado.',
  },
  {
    level_index: 3,
    name: 'Validação',
    description:
      'MVP funcional em uso por usuários reais, coleta contínua de feedback estruturado, métricas de ativação acompanhadas e perfil de early adopters identificado a partir de dados.',
  },
  {
    level_index: 4,
    name: 'Product-Market Fit',
    description:
      'Evidências quantitativas de encaixe produto-mercado: retenção forte, engajamento recorrente, NPS medido, recomendações orgânicas e pelo menos um canal de crescimento identificado.',
  },
  {
    level_index: 5,
    name: 'Tração',
    description:
      'Clientes pagantes recorrentes, processo comercial documentado e repetível, unit economics conhecidos (CAC, LTV, churn) e pipeline de vendas estruturado em CRM.',
  },
  {
    level_index: 6,
    name: 'Escala',
    description:
      'Crescimento consistente mês a mês, time estruturado com governança, captação de investimento em andamento ou concluída e iniciativas ativas de expansão geográfica ou de portfólio.',
  },
];
