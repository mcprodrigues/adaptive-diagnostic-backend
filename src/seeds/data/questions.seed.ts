import { QuestionType } from 'src/modules/question/enums/question-type.enum';
import { QuestionOption } from 'src/modules/question/question.entity';

export interface QuestionSeed {
  level_index: number;
  order_in_level: number;
  text: string;
  question_type: QuestionType;
  options: QuestionOption[];
}

const yesNo = (passesOnYes = true): QuestionOption[] => [
  { value: 'yes', label: 'Sim', passes: passesOnYes },
  { value: 'no', label: 'Não', passes: !passesOnYes },
];

export const QUESTIONS_SEEDS: QuestionSeed[] = [
  // --- Nível 1 — Ideação ---
  {
    level_index: 1,
    order_in_level: 1,
    text: 'Você consegue descrever em uma frase curta o problema que a startup resolve?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 1,
    order_in_level: 2,
    text: 'O público-alvo (persona) da solução está mapeado e documentado?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 1,
    order_in_level: 3,
    text: 'A equipe fundadora está definida, com papéis atribuídos e dedicação comprometida?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 1,
    order_in_level: 4,
    text: 'Existe uma proposta de valor escrita (ex.: Value Proposition Canvas, Lean Canvas)?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 1,
    order_in_level: 5,
    text: 'Os concorrentes diretos e indiretos foram mapeados com diferenciação explícita?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 1,
    order_in_level: 6,
    text: 'Quantas horas por semana a equipe fundadora dedica ao projeto, em média?',
    question_type: QuestionType.SCALE,
    options: [
      { value: '0-5', label: 'Menos de 5 horas', passes: false },
      { value: '6-15', label: 'Entre 6 e 15 horas', passes: false },
      { value: '16-30', label: 'Entre 16 e 30 horas', passes: true },
      {
        value: '30+',
        label: 'Mais de 30 horas (dedicação integral)',
        passes: true,
      },
    ],
  },
  {
    level_index: 1,
    order_in_level: 7,
    text: 'As principais hipóteses de negócio (problema, solução, cliente) estão documentadas de forma testável?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },

  // --- Nível 2 — Descoberta ---
  {
    level_index: 2,
    order_in_level: 1,
    text: 'Quantas entrevistas exploratórias com potenciais clientes já foram realizadas?',
    question_type: QuestionType.SCALE,
    options: [
      { value: '0-5', label: 'Menos de 5', passes: false },
      { value: '6-15', label: 'Entre 6 e 15', passes: false },
      { value: '16-40', label: 'Entre 16 e 40', passes: true },
      { value: '40+', label: 'Mais de 40', passes: true },
    ],
  },
  {
    level_index: 2,
    order_in_level: 2,
    text: 'Os Jobs-to-be-Done (tarefas/objetivos que o cliente tenta resolver) estão identificados e priorizados?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 2,
    order_in_level: 3,
    text: 'As personas foram validadas com dados reais coletados em entrevistas ou pesquisas?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 2,
    order_in_level: 4,
    text: 'O problema foi validado em pelo menos dois segmentos distintos de clientes?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 2,
    order_in_level: 5,
    text: 'A dor foi quantificada (frequência com que ocorre, intensidade, custo financeiro ou de tempo)?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 2,
    order_in_level: 6,
    text: 'Qual a porcentagem aproximada de entrevistados que confirmaram sentir a dor identificada?',
    question_type: QuestionType.SCALE,
    options: [
      { value: '0-25', label: 'Menos de 25%', passes: false },
      { value: '26-50', label: 'Entre 26% e 50%', passes: false },
      { value: '51-75', label: 'Entre 51% e 75%', passes: true },
      { value: '75+', label: 'Mais de 75%', passes: true },
    ],
  },
  {
    level_index: 2,
    order_in_level: 7,
    text: 'Houve pelo menos um pivô ou refinamento relevante da hipótese inicial com base nos aprendizados da descoberta?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },

  // --- Nível 3 — Validação ---
  {
    level_index: 3,
    order_in_level: 1,
    text: 'Existe um MVP ou protótipo funcional sendo usado por usuários reais (mesmo que gratuitos)?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 3,
    order_in_level: 2,
    text: 'Vocês coletam feedback estruturado dos usuários (entrevistas recorrentes, pesquisas, análises de uso)?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 3,
    order_in_level: 3,
    text: 'Pelo menos uma métrica de ativação/engajamento é acompanhada continuamente?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 3,
    order_in_level: 4,
    text: 'Quantos usuários ativos mensais (MAU) o MVP possui atualmente?',
    question_type: QuestionType.SCALE,
    options: [
      { value: '0-20', label: 'Até 20', passes: false },
      { value: '21-100', label: 'Entre 21 e 100', passes: true },
      { value: '101-500', label: 'Entre 101 e 500', passes: true },
      { value: '500+', label: 'Mais de 500', passes: true },
    ],
  },
  {
    level_index: 3,
    order_in_level: 5,
    text: 'O perfil dos primeiros adotantes (early adopters) foi identificado a partir de dados reais de uso?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 3,
    order_in_level: 6,
    text: 'Pelo menos uma das principais hipóteses de solução foi confirmada ou refutada com base no uso real do MVP?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 3,
    order_in_level: 7,
    text: 'Qual o tempo médio de onboarding (do cadastro à primeira ação de valor) dos novos usuários?',
    question_type: QuestionType.SCALE,
    options: [
      { value: 'none', label: 'Não é medido', passes: false },
      { value: 'slow', label: 'Mais de 1 semana', passes: false },
      { value: 'medium', label: 'Entre 1 e 7 dias', passes: true },
      { value: 'fast', label: 'Menos de 24 horas', passes: true },
    ],
  },

  // --- Nível 4 — Product-Market Fit ---
  {
    level_index: 4,
    order_in_level: 1,
    text: 'A retenção de usuários na semana 4 (W4) se mantém acima de 20%?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 4,
    order_in_level: 2,
    text: 'No Sean Ellis Test ("Como você se sentiria se não pudesse mais usar o produto?"), qual a porcentagem de usuários que responde "muito desapontado"?',
    question_type: QuestionType.SCALE,
    options: [
      { value: 'none', label: 'Não foi aplicado', passes: false },
      { value: 'low', label: 'Menos de 20%', passes: false },
      { value: 'mid', label: 'Entre 20% e 40%', passes: true },
      { value: 'high', label: 'Mais de 40%', passes: true },
    ],
  },
  {
    level_index: 4,
    order_in_level: 3,
    text: 'O NPS (Net Promoter Score) é medido de forma recorrente?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 4,
    order_in_level: 4,
    text: 'Qual é o NPS atual do produto?',
    question_type: QuestionType.SCALE,
    options: [
      { value: 'negative', label: 'Negativo', passes: false },
      { value: 'low', label: 'Entre 0 e 30', passes: false },
      { value: 'mid', label: 'Entre 31 e 50', passes: true },
      { value: 'high', label: 'Acima de 50', passes: true },
    ],
  },
  {
    level_index: 4,
    order_in_level: 5,
    text: 'Existem evidências claras de recomendação orgânica (boca a boca, referrals sem incentivo)?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 4,
    order_in_level: 6,
    text: 'Pelo menos um canal de aquisição escalável foi identificado e validado (ex.: SEO, paid, comunidade, parcerias)?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 4,
    order_in_level: 7,
    text: 'Há um ciclo de uso recorrente comprovado (DAU/MAU saudável ou uso semanal sustentado)?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },

  // --- Nível 5 — Tração ---
  {
    level_index: 5,
    order_in_level: 1,
    text: 'A startup possui clientes pagantes recorrentes (assinatura, contrato, mensalidade)?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 5,
    order_in_level: 2,
    text: 'Qual é a receita mensal recorrente (MRR) atual?',
    question_type: QuestionType.SCALE,
    options: [
      { value: '0-5k', label: 'Até R$ 5 mil', passes: false },
      { value: '5k-25k', label: 'Entre R$ 5 mil e R$ 25 mil', passes: true },
      {
        value: '25k-100k',
        label: 'Entre R$ 25 mil e R$ 100 mil',
        passes: true,
      },
      { value: '100k+', label: 'Mais de R$ 100 mil', passes: true },
    ],
  },
  {
    level_index: 5,
    order_in_level: 3,
    text: 'Existe um processo comercial repetível e documentado para aquisição de novos clientes?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 5,
    order_in_level: 4,
    text: 'O CAC (custo de aquisição) e o LTV (valor vitalício) já foram calculados com base em dados reais?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 5,
    order_in_level: 5,
    text: 'Qual é a razão LTV/CAC atual?',
    question_type: QuestionType.SCALE,
    options: [
      { value: 'none', label: 'Ainda não calculamos', passes: false },
      { value: 'below', label: 'Menor que 3', passes: false },
      { value: 'mid', label: 'Entre 3 e 5', passes: true },
      { value: 'high', label: 'Acima de 5', passes: true },
    ],
  },
  {
    level_index: 5,
    order_in_level: 6,
    text: 'O churn mensal é acompanhado e se mantém abaixo de 10% (mensal) para SaaS, ou equivalente para o seu modelo?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 5,
    order_in_level: 7,
    text: 'Existe um pipeline de vendas estruturado em CRM, com SLAs e estágios bem definidos?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },

  // --- Nível 6 — Escala ---
  {
    level_index: 6,
    order_in_level: 1,
    text: 'A receita cresceu de forma consistente mês sobre mês nos últimos 6 meses?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 6,
    order_in_level: 2,
    text: 'Qual a taxa média de crescimento mensal (MoM) nos últimos 6 meses?',
    question_type: QuestionType.SCALE,
    options: [
      { value: 'low', label: 'Menos de 5%', passes: false },
      { value: 'mid', label: 'Entre 5% e 10%', passes: true },
      { value: 'high', label: 'Entre 10% e 20%', passes: true },
      { value: 'top', label: 'Acima de 20%', passes: true },
    ],
  },
  {
    level_index: 6,
    order_in_level: 3,
    text: 'Quantas pessoas compõem o time hoje (sócios + CLT + PJ)?',
    question_type: QuestionType.SCALE,
    options: [
      { value: '1-5', label: 'Entre 1 e 5', passes: false },
      { value: '6-15', label: 'Entre 6 e 15', passes: true },
      { value: '16-50', label: 'Entre 16 e 50', passes: true },
      { value: '50+', label: 'Mais de 50', passes: true },
    ],
  },
  {
    level_index: 6,
    order_in_level: 4,
    text: 'Existe uma estrutura de gestão financeira com fluxo de caixa projetado, DRE mensal e acompanhamento periódico?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 6,
    order_in_level: 5,
    text: 'A startup captou ou está em processo ativo de captação de investimento (Seed, Série A ou superior)?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 6,
    order_in_level: 6,
    text: 'Existem iniciativas estruturadas de expansão (novos mercados geográficos, novos verticais ou novas linhas de produto)?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
  {
    level_index: 6,
    order_in_level: 7,
    text: 'Existe uma estrutura de governança (board, conselho consultivo ou comitês) acompanhando a operação?',
    question_type: QuestionType.BOOLEAN,
    options: yesNo(),
  },
];
