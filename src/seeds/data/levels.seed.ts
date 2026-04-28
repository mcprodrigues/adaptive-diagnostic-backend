import { KthDimension } from 'src/modules/question/level.entity';

export interface LevelSeed {
  dimension: KthDimension;
  level_index: number;
  name: string;
  description: string;
}

export const LEVELS_SEEDS: LevelSeed[] = [
  {
    dimension: KthDimension.CRL,
    level_index: 1,
    name: 'CRL 1 — Hipóteses sobre o mercado',
    description:
      'Hipóteses sobre possíveis necessidades no mercado. Ausência de hipóteses claras sobre quem são os clientes e quais problemas resolvem.',
  },
  {
    dimension: KthDimension.CRL,
    level_index: 2,
    name: 'CRL 2 — Necessidades específicas identificadas',
    description:
      'Necessidades específicas identificadas no mercado a partir de pesquisa secundária. Descrição mais clara do problema; ideias de solução ainda especulativas.',
  },
  {
    dimension: KthDimension.CRL,
    level_index: 3,
    name: 'CRL 3 — Primeiro feedback do mercado',
    description:
      'Descoberta inicial de clientes com pesquisa primária junto a possíveis usuários ou especialistas. Hipótese de problema mais clara.',
  },
  {
    dimension: KthDimension.CRL,
    level_index: 4,
    name: 'CRL 4 — Problema confirmado por múltiplos clientes',
    description:
      'Problema/necessidade confirmado por diversos clientes ou usuários. Segmentação implementada e hipótese primária de produto definida.',
  },
  {
    dimension: KthDimension.CRL,
    level_index: 5,
    name: 'CRL 5 — Interesse e relacionamento estabelecidos',
    description:
      'Interesse estabelecido pelo produto e relacionamento com clientes-alvo. Adequação inicial problema-solução confirmada e segmentação de mercado-alvo definida.',
  },
  {
    dimension: KthDimension.CRL,
    level_index: 6,
    name: 'CRL 6 — Benefícios confirmados em testes',
    description:
      'Benefícios do produto confirmados em testes com clientes ou parcerias. Processo/roteiro de vendas formalmente definido e iniciado.',
  },
  {
    dimension: KthDimension.CRL,
    level_index: 7,
    name: 'CRL 7 — Primeiras vendas e testes extensivos',
    description:
      'Clientes em testes extensivos do produto ou primeiras vendas de teste. Esforços de vendas e desenvolvimento de negócios em ramp-up.',
  },
  {
    dimension: KthDimension.CRL,
    level_index: 8,
    name: 'CRL 8 — Vendas iniciais estruturadas',
    description:
      'Primeiros produtos vendidos e esforços de vendas estruturados. Perfil ideal de cliente, capacidade de pagamento e tamanho de mercado validados.',
  },
  {
    dimension: KthDimension.CRL,
    level_index: 9,
    name: 'CRL 9 — Vendas em escala',
    description:
      'Vendas generalizadas do produto que escalam. Modelo comercial definido, portfólio de clientes fidelizados e capacidade de crescer mantendo eficiência operacional.',
  },
];
