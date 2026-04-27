import { KthDimension } from 'src/modules/question/level.entity';

export interface QuestionSeed {
  dimension: KthDimension;
  level_index: number;
  order_in_level: number;
  text: string;
}

const D = KthDimension.CRL;

export const QUESTIONS_SEEDS: QuestionSeed[] = [
  // -------------------------------------------------------------------------
  // CRL 1
  // -------------------------------------------------------------------------
  {
    dimension: D,
    level_index: 1,
    order_in_level: 1,
    text: 'O produto/solução ainda não foi testado, baseia-se numa crença de necessidade do mercado.',
  },
  {
    dimension: D,
    level_index: 1,
    order_in_level: 2,
    text: 'As hipóteses de quem seriam seus clientes potenciais ainda não foram validadas.',
  },
  {
    dimension: D,
    level_index: 1,
    order_in_level: 3,
    text: 'A startup ainda tem conhecimento limitado, ou falta de conhecimento sobre o mercado e seus clientes ou usuários potenciais.',
  },

  // -------------------------------------------------------------------------
  // CRL 2
  // -------------------------------------------------------------------------
  {
    dimension: D,
    level_index: 2,
    order_in_level: 1,
    text: 'A startup realizou pesquisas iniciais sobre o mercado, usando dados secundários.',
  },
  {
    dimension: D,
    level_index: 2,
    order_in_level: 2,
    text: 'A startup sente-se mais familiarizada com o mercado do que no processo de ideação inicial, mas ainda não tem conhecimento profundo deste.',
  },
  {
    dimension: D,
    level_index: 2,
    order_in_level: 3,
    text: 'A startup elaborou uma definição específica do problema ou necessidade que pretende solucionar.',
  },
  {
    dimension: D,
    level_index: 2,
    order_in_level: 4,
    text: 'Ideias de produtos e soluções existem, mas ainda não foram delimitadas e validadas no mercado.',
  },

  // -------------------------------------------------------------------------
  // CRL 3
  // -------------------------------------------------------------------------
  {
    dimension: D,
    level_index: 3,
    order_in_level: 1,
    text: 'A startup realizou pesquisa sobre o mercado com consulta direta a possíveis usuários/clientes ou pessoas com conhecimento do setor/mercado (dados primários).',
  },
  {
    dimension: D,
    level_index: 3,
    order_in_level: 2,
    text: 'A startup compreende que possui uma hipótese mais clara acerca do problema que seu produto ou solução pretende resolver, quando comparado aos estágios iniciais de ideação.',
  },

  // -------------------------------------------------------------------------
  // CRL 4
  // -------------------------------------------------------------------------
  {
    dimension: D,
    level_index: 4,
    order_in_level: 1,
    text: 'A startup iniciou contatos e obtenção de feedback com clientes/usuários em potencial.',
  },
  {
    dimension: D,
    level_index: 4,
    order_in_level: 2,
    text: 'O problema ou a necessidade dos clientes potenciais foram formalmente confirmadas por múltiplos perfis de usuários.',
  },
  {
    dimension: D,
    level_index: 4,
    order_in_level: 3,
    text: 'A startup implementou uma segmentação de cliente, possibilitando detalhamento de clientes e usuários potenciais.',
  },
  {
    dimension: D,
    level_index: 4,
    order_in_level: 4,
    text: 'A hipótese primária do produto/solução foi definida nesta fase com base em um feedback de um stakeholder.',
  },

  // -------------------------------------------------------------------------
  // CRL 5
  // -------------------------------------------------------------------------
  {
    dimension: D,
    level_index: 5,
    order_in_level: 1,
    text: 'Confirmada adequação inicial do produto para solução do problema dos clientes em potencial.',
  },
  {
    dimension: D,
    level_index: 5,
    order_in_level: 2,
    text: 'A startup identificou seu cliente-alvo.',
  },
  {
    dimension: D,
    level_index: 5,
    order_in_level: 3,
    text: 'A startup estudou o perfil do mercado-alvo e possui entendimento deste de forma mais profunda.',
  },
  {
    dimension: D,
    level_index: 5,
    order_in_level: 4,
    text: 'A startup iniciou processo de fortalecimento e aproximação com clientes em potencial.',
  },
  {
    dimension: D,
    level_index: 5,
    order_in_level: 5,
    text: 'Contatos com clientes e consumidores em potencial possibilitaram o fornecimento de requisitos e protótipos iniciais.',
  },
  {
    dimension: D,
    level_index: 5,
    order_in_level: 6,
    text: 'Definida segmentação de mercado-alvo.',
  },

  // -------------------------------------------------------------------------
  // CRL 6
  // -------------------------------------------------------------------------
  {
    dimension: D,
    level_index: 6,
    order_in_level: 1,
    text: 'Os testes de produto têm confirmado a avaliação da proposta de valor do produto e seus benefícios para solução do problema dos usuários.',
  },
  {
    dimension: D,
    level_index: 6,
    order_in_level: 2,
    text: 'Foi firmada parceria com pelo menos um stakeholder-chave da cadeia de valor para a startup.',
  },
  {
    dimension: D,
    level_index: 6,
    order_in_level: 3,
    text: 'A startup definiu formalmente um processo/roteiro de vendas.',
  },
  {
    dimension: D,
    level_index: 6,
    order_in_level: 4,
    text: 'A startup iniciou as atividades de vendas conforme seu processo/roteiro de venda.',
  },

  // -------------------------------------------------------------------------
  // CRL 7
  // -------------------------------------------------------------------------
  {
    dimension: D,
    level_index: 7,
    order_in_level: 1,
    text: 'A startup formalizou os primeiros contratos de vendas.',
  },
  {
    dimension: D,
    level_index: 7,
    order_in_level: 2,
    text: 'Os primeiros clientes da startup validaram a solução/produto.',
  },
  {
    dimension: D,
    level_index: 7,
    order_in_level: 3,
    text: 'Contamos com clientes e stakeholders relevantes envolvidos na qualificação/testes extensivos do produto.',
  },
  {
    dimension: D,
    level_index: 7,
    order_in_level: 4,
    text: 'A startup tem aumentado os esforços de desenvolvimento de negócios.',
  },
  {
    dimension: D,
    level_index: 7,
    order_in_level: 5,
    text: 'A startup tem aumentado os esforços de vendas de acordo com processo estabelecido e roadmap de vendas.',
  },

  // -------------------------------------------------------------------------
  // CRL 8
  // -------------------------------------------------------------------------
  {
    dimension: D,
    level_index: 8,
    order_in_level: 1,
    text: 'A startup já identificou o perfil ideal de clientes e realizou algumas vendas.',
  },
  {
    dimension: D,
    level_index: 8,
    order_in_level: 2,
    text: 'O perfil de consumidor para o produto da startup tem capacidade de pagamento para aquisição do produto.',
  },
  {
    dimension: D,
    level_index: 8,
    order_in_level: 3,
    text: 'O tamanho do mercado para o produto da startup é suficiente para sustentabilidade do negócio.',
  },
  {
    dimension: D,
    level_index: 8,
    order_in_level: 4,
    text: 'A startup identificou o perfil dos compradores reais de sua solução.',
  },
  {
    dimension: D,
    level_index: 8,
    order_in_level: 5,
    text: 'O modelo de gestão da startup tem processos e sistemas definidos e operacionais adequados ao crescimento de vendas e operação.',
  },

  // -------------------------------------------------------------------------
  // CRL 9
  // -------------------------------------------------------------------------
  {
    dimension: D,
    level_index: 9,
    order_in_level: 1,
    text: 'A startup definiu o modelo comercial do produto.',
  },
  {
    dimension: D,
    level_index: 9,
    order_in_level: 2,
    text: 'A startup possui portfólio ativo de clientes já fidelizados.',
  },
  {
    dimension: D,
    level_index: 9,
    order_in_level: 3,
    text: 'A startup possui capacidade de crescer e aumentar sua produção, receita ou base de usuários rapidamente, sem aumentar os custos operacionais na mesma proporção.',
  },
  {
    dimension: D,
    level_index: 9,
    order_in_level: 4,
    text: 'A startup está focada em construir sua base de clientes.',
  },
];
