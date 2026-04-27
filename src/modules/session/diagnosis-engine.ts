import { AppError } from 'src/shared/errors/app-error';
import { isIntegerInRange } from 'src/shared/utils/validations';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

export const DIAGNOSIS_DEFAULTS = {
  MAX_LEVEL: 9,
} as const;

export const DiagnosisPhase = {
  SEARCH: 'search',
  ROADMAP: 'roadmap',
  COMPLETED: 'completed',
} as const;

export type DiagnosisPhase =
  (typeof DiagnosisPhase)[keyof typeof DiagnosisPhase];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Number of affirmatives at a given level (1-based). The engine queries this
 * to know when a level has been fully covered (search phase) and how many
 * roadmap answers must be collected (roadmap phase).
 */
export type AffirmativesAtLevel = (level: number) => number;

export interface DiagnosisState {
  readonly maxLevel: number;
  readonly declaredLevel: number;
  readonly floor: number;
  readonly ceiling: number;
  readonly currentLevel: number;
  readonly currentLevelAnswered: number;
  readonly roadmapLevel: number | null;
  readonly roadmapAnswered: number;
  readonly phase: DiagnosisPhase;
  readonly finalLevel: number | null;
}

export interface StartDiagnosisInput {
  declaredLevel: number;
  maxLevel?: number;
}

export interface AnswerInput {
  passed: boolean;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export function startDiagnosis(input: StartDiagnosisInput): DiagnosisState {
  const maxLevel = input.maxLevel ?? DIAGNOSIS_DEFAULTS.MAX_LEVEL;

  if (!isIntegerInRange(maxLevel, 1, Number.MAX_SAFE_INTEGER)) {
    throw new AppError('maxLevel must be a positive integer.', 400);
  }
  if (!isIntegerInRange(input.declaredLevel, 1, maxLevel)) {
    throw new AppError(
      `declaredLevel must be an integer between 1 and ${maxLevel}.`,
      400,
    );
  }

  return {
    maxLevel,
    declaredLevel: input.declaredLevel,
    floor: 0,
    ceiling: maxLevel,
    currentLevel: input.declaredLevel,
    currentLevelAnswered: 0,
    roadmapLevel: null,
    roadmapAnswered: 0,
    phase: DiagnosisPhase.SEARCH,
    finalLevel: null,
  };
}

export function applyAnswer(
  state: DiagnosisState,
  input: AnswerInput,
  affirmativesAtLevel: AffirmativesAtLevel,
): DiagnosisState {
  switch (state.phase) {
    case DiagnosisPhase.COMPLETED:
      throw new AppError('The diagnosis has already been completed.', 400);
    case DiagnosisPhase.SEARCH:
      return applySearchAnswer(state, input, affirmativesAtLevel);
    case DiagnosisPhase.ROADMAP:
      return applyRoadmapAnswer(state, affirmativesAtLevel);
  }
}

// ---------------------------------------------------------------------------
// Search phase: adaptive midpoint binary search.
// A level is passed only after every affirmative at that level is answered
// "yes"; a single "no" fails the level immediately and narrows the upper bound.
// ---------------------------------------------------------------------------

function applySearchAnswer(
  state: DiagnosisState,
  { passed }: AnswerInput,
  affirmativesAtLevel: AffirmativesAtLevel,
): DiagnosisState {
  if (!passed) {
    return narrowAndProbe(
      state,
      { floor: state.floor, ceiling: state.currentLevel - 1 },
      affirmativesAtLevel,
    );
  }

  const answered = state.currentLevelAnswered + 1;
  const required = affirmativesAtLevel(state.currentLevel);
  if (answered < required) {
    return { ...state, currentLevelAnswered: answered };
  }

  return narrowAndProbe(
    state,
    { floor: state.currentLevel, ceiling: state.ceiling },
    affirmativesAtLevel,
  );
}

function narrowAndProbe(
  state: DiagnosisState,
  bounds: { floor: number; ceiling: number },
  affirmativesAtLevel: AffirmativesAtLevel,
): DiagnosisState {
  if (bounds.floor >= bounds.ceiling) {
    return finishSearch(state, bounds.floor, affirmativesAtLevel);
  }
  return {
    ...state,
    floor: bounds.floor,
    ceiling: bounds.ceiling,
    currentLevel: nextLevelToProbe(bounds),
    currentLevelAnswered: 0,
  };
}

function nextLevelToProbe({
  floor,
  ceiling,
}: {
  floor: number;
  ceiling: number;
}): number {
  // Midpoint over the still-unconfirmed interval (floor, ceiling].
  // floor+1 because floor is already validated.
  return Math.floor((floor + 1 + ceiling) / 2);
}

function finishSearch(
  state: DiagnosisState,
  finalLevel: number,
  affirmativesAtLevel: AffirmativesAtLevel,
): DiagnosisState {
  if (finalLevel >= state.maxLevel) {
    return completeDiagnosis(state, finalLevel);
  }
  const roadmapLevel = finalLevel + 1;
  if (affirmativesAtLevel(roadmapLevel) <= 0) {
    return completeDiagnosis(state, finalLevel);
  }
  return {
    ...state,
    floor: finalLevel,
    ceiling: finalLevel,
    currentLevel: roadmapLevel,
    currentLevelAnswered: 0,
    roadmapLevel,
    roadmapAnswered: 0,
    phase: DiagnosisPhase.ROADMAP,
    finalLevel,
  };
}

// ---------------------------------------------------------------------------
// Roadmap phase: enumerate all affirmatives of finalLevel + 1 to surface
// the personalised gap list. Answers (yes/no) are persisted by the caller;
// the engine just counts until the level is fully enumerated.
// ---------------------------------------------------------------------------

function applyRoadmapAnswer(
  state: DiagnosisState,
  affirmativesAtLevel: AffirmativesAtLevel,
): DiagnosisState {
  if (state.roadmapLevel === null || state.finalLevel === null) {
    throw new AppError('Inconsistent roadmap state.', 500);
  }
  const answered = state.roadmapAnswered + 1;
  const required = affirmativesAtLevel(state.roadmapLevel);
  if (answered < required) {
    return { ...state, roadmapAnswered: answered };
  }
  return completeDiagnosis(state, state.finalLevel);
}

function completeDiagnosis(
  state: DiagnosisState,
  finalLevel: number,
): DiagnosisState {
  return {
    ...state,
    floor: finalLevel,
    ceiling: finalLevel,
    currentLevel: finalLevel,
    currentLevelAnswered: 0,
    phase: DiagnosisPhase.COMPLETED,
    finalLevel,
  };
}
