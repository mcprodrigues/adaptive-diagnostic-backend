import { AppError } from 'src/shared/errors/app-error';
import { isIntegerInRange } from 'src/shared/utils/validations';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const DIAGNOSIS_DEFAULTS = {
  MAX_LEVEL: 6,
  QUESTIONS_PER_LEVEL: 7,
} as const;

export const DiagnosisStatus = {
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
} as const;

export type DiagnosisStatus =
  (typeof DiagnosisStatus)[keyof typeof DiagnosisStatus];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DiagnosisConfig {
  readonly maxLevel: number;
  readonly questionsPerLevel: number;
}

interface DiagnosisProgress {
  readonly floor: number;
  readonly ceiling: number;
  readonly currentLevel: number;
  readonly currentLevelAnswered: number;
}

export type DiagnosisState = DiagnosisConfig &
  DiagnosisProgress &
  (
    | { status: typeof DiagnosisStatus.IN_PROGRESS; finalLevel: null }
    | { status: typeof DiagnosisStatus.COMPLETED; finalLevel: number }
  );

export interface StartDiagnosisInput {
  declaredLevel: number;
  maxLevel?: number;
  questionsPerLevel?: number;
}

export interface AnswerInput {
  passed: boolean;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function startDiagnosis(input: StartDiagnosisInput): DiagnosisState {
  const maxLevel = input.maxLevel ?? DIAGNOSIS_DEFAULTS.MAX_LEVEL;
  const questionsPerLevel =
    input.questionsPerLevel ?? DIAGNOSIS_DEFAULTS.QUESTIONS_PER_LEVEL;

  if (!isIntegerInRange(maxLevel, 1, Number.MAX_SAFE_INTEGER)) {
    throw new AppError('maxLevel must be a positive integer.', 400);
  }
  if (!isIntegerInRange(questionsPerLevel, 1, Number.MAX_SAFE_INTEGER)) {
    throw new AppError('questionsPerLevel must be a positive integer.', 400);
  }
  if (!isIntegerInRange(input.declaredLevel, 1, maxLevel)) {
    throw new AppError(
      `declaredLevel must be a positive integer between 1 and ${maxLevel}.`,
      400,
    );
  }

  return {
    maxLevel,
    questionsPerLevel,
    floor: 0,
    ceiling: maxLevel,
    currentLevel: input.declaredLevel,
    currentLevelAnswered: 0,
    status: DiagnosisStatus.IN_PROGRESS,
    finalLevel: null,
  };
}

export function applyAnswer(
  state: DiagnosisState,
  { passed }: AnswerInput,
): DiagnosisState {
  if (state.status === DiagnosisStatus.COMPLETED) {
    throw new AppError('The diagnosis has already been completed.', 400);
  }

  return passed ? handleSuccess(state) : handleFailure(state);
}

// ---------------------------------------------------------------------------
// State transitions (private)
// ---------------------------------------------------------------------------

function handleFailure(state: DiagnosisState): DiagnosisState {
  // Falha -> o nível atual vira o novo teto; buscamos abaixo.
  return narrowInterval(state, {
    floor: state.floor,
    ceiling: state.currentLevel - 1,
  });
}

function handleSuccess(state: DiagnosisState): DiagnosisState {
  const answered = state.currentLevelAnswered + 1;
  const levelCompleted = answered >= state.questionsPerLevel;

  if (!levelCompleted) {
    return { ...state, currentLevelAnswered: answered };
  }

  // Nível validado -> vira o novo piso; buscamos acima.
  return narrowInterval(state, {
    floor: state.currentLevel,
    ceiling: state.ceiling,
  });
}
+9;
function narrowInterval(
  state: DiagnosisState,
  bounds: { floor: number; ceiling: number },
): DiagnosisState {
  if (hasConverged(bounds)) {
    return completeDiagnosis(state, bounds.floor);
  }

  return {
    ...state,
    floor: bounds.floor,
    ceiling: bounds.ceiling,
    currentLevel: nextLevelToProbe(bounds),
    currentLevelAnswered: 0,
  };
}

function hasConverged({
  floor,
  ceiling,
}: {
  floor: number;
  ceiling: number;
}): boolean {
  return floor >= ceiling;
}

function nextLevelToProbe({
  floor,
  ceiling,
}: {
  floor: number;
  ceiling: number;
}): number {
  // Ponto médio dos candidatos ainda não validados: (floor, ceiling].
  // Somamos 1 ao floor porque ele já foi validado; o próximo teste
  // deve ser estritamente acima dele.
  return Math.floor((floor + 1 + ceiling) / 2);
}

function completeDiagnosis(
  state: DiagnosisState,
  finalLevel: number,
): DiagnosisState {
  return {
    ...state,
    floor: finalLevel,
    ceiling: finalLevel,
    currentLevelAnswered: 0,
    status: DiagnosisStatus.COMPLETED,
    finalLevel,
  };
}
