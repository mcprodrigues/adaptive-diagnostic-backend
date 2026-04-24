import {
  applyAnswer,
  DIAGNOSIS_DEFAULTS,
  DiagnosisState,
  startDiagnosis,
} from '../diagnosis-engine';

const passN = (state: DiagnosisState, n: number): DiagnosisState => {
  let s = state;
  for (let i = 0; i < n; i++) s = applyAnswer(s, { passed: true });
  return s;
};

describe('diagnosis-engine', () => {
  describe('startDiagnosis', () => {
    it('initializes state with defaults from DIAGNOSIS_DEFAULTS', () => {
      const declaredLevel = Math.min(3, DIAGNOSIS_DEFAULTS.MAX_LEVEL);
      const state = startDiagnosis({ declaredLevel });
      expect(state).toMatchObject({
        floor: 0,
        ceiling: DIAGNOSIS_DEFAULTS.MAX_LEVEL,
        currentLevel: declaredLevel,
        maxLevel: DIAGNOSIS_DEFAULTS.MAX_LEVEL,
        questionsPerLevel: DIAGNOSIS_DEFAULTS.QUESTIONS_PER_LEVEL,
        currentLevelAnswered: 0,
        status: 'in_progress',
        finalLevel: null,
      });
    });

    it('rejects declaredLevel out of range', () => {
      expect(() => startDiagnosis({ declaredLevel: 0 })).toThrow(
        /declaredLevel/,
      );
      expect(() =>
        startDiagnosis({ declaredLevel: DIAGNOSIS_DEFAULTS.MAX_LEVEL + 1 }),
      ).toThrow(/declaredLevel/);
      expect(() => startDiagnosis({ declaredLevel: 1.5 })).toThrow(
        /declaredLevel/,
      );
    });

    it('accepts custom maxLevel and questionsPerLevel', () => {
      const state = startDiagnosis({
        declaredLevel: 2,
        maxLevel: 9,
        questionsPerLevel: 18,
      });
      expect(state.maxLevel).toBe(9);
      expect(state.questionsPerLevel).toBe(18);
      expect(state.ceiling).toBe(9);
    });
  });

  describe('applyAnswer — climbing (all passes)', () => {
    it('passes 5 at level 3 → floor=3, target=4', () => {
      let s = startDiagnosis({
        declaredLevel: 3,
        maxLevel: 4,
        questionsPerLevel: 5,
      });
      s = passN(s, 5);
      expect(s.floor).toBe(3);
      expect(s.ceiling).toBe(4);
      expect(s.currentLevel).toBe(4);
      expect(s.currentLevelAnswered).toBe(0);
      expect(s.status).toBe('in_progress');
    });

    it('passes all 4 levels sequentially → finalLevel=4', () => {
      let s = startDiagnosis({
        declaredLevel: 4,
        maxLevel: 4,
        questionsPerLevel: 5,
      });
      s = passN(s, 5);
      expect(s.status).toBe('completed');
      expect(s.finalLevel).toBe(4);
    });

    it('declares 1 and keeps passing climbs through the midpoints', () => {
      let s = startDiagnosis({
        declaredLevel: 1,
        maxLevel: 4,
        questionsPerLevel: 5,
      });
      s = passN(s, 5);
      expect(s.floor).toBe(1);
      expect(s.currentLevel).toBe(3);
      s = passN(s, 5);
      expect(s.floor).toBe(3);
      expect(s.currentLevel).toBe(4);
      s = passN(s, 5);
      expect(s.status).toBe('completed');
      expect(s.finalLevel).toBe(4);
    });
  });

  describe('applyAnswer — descending (short-circuit on fail)', () => {
    it('fails immediately at declared level 3 → tests lower midpoint next', () => {
      let s = startDiagnosis({
        declaredLevel: 3,
        maxLevel: 4,
        questionsPerLevel: 5,
      });
      s = applyAnswer(s, { passed: false });
      expect(s.floor).toBe(0);
      expect(s.ceiling).toBe(2);
      expect(s.currentLevel).toBe(1);
      expect(s.currentLevelAnswered).toBe(0);
      expect(s.status).toBe('in_progress');
    });

    it('fails at level 1 with floor=0 → finalLevel=0 (below baseline)', () => {
      let s = startDiagnosis({
        declaredLevel: 1,
        maxLevel: 4,
        questionsPerLevel: 5,
      });
      s = applyAnswer(s, { passed: false });
      expect(s.status).toBe('completed');
      expect(s.finalLevel).toBe(0);
    });

    it('declared 3 but real level is 1 — converges', () => {
      let s = startDiagnosis({
        declaredLevel: 3,
        maxLevel: 4,
        questionsPerLevel: 5,
      });
      s = applyAnswer(s, { passed: false });
      expect(s.currentLevel).toBe(1);
      s = passN(s, 5);
      expect(s.floor).toBe(1);
      expect(s.ceiling).toBe(2);
      expect(s.currentLevel).toBe(2);
      s = applyAnswer(s, { passed: false });
      expect(s.status).toBe('completed');
      expect(s.finalLevel).toBe(1);
    });
  });

  describe('convergence edge cases', () => {
    it('passes at MAX with ceiling already there → done at MAX', () => {
      let s = startDiagnosis({
        declaredLevel: 4,
        maxLevel: 4,
        questionsPerLevel: 5,
      });
      s = passN(s, 5);
      expect(s.status).toBe('completed');
      expect(s.finalLevel).toBe(4);
    });

    it('climbs to 3, then fails 4 → finalLevel=3', () => {
      let s = startDiagnosis({
        declaredLevel: 3,
        maxLevel: 4,
        questionsPerLevel: 5,
      });
      s = passN(s, 5);
      s = applyAnswer(s, { passed: false });
      expect(s.status).toBe('completed');
      expect(s.finalLevel).toBe(3);
    });

    it('mixed: declared 2, passes 2, fails 3 → finalLevel=2', () => {
      let s = startDiagnosis({
        declaredLevel: 2,
        maxLevel: 4,
        questionsPerLevel: 5,
      });
      s = passN(s, 5);
      expect(s.currentLevel).toBe(3);
      s = applyAnswer(s, { passed: false });
      expect(s.status).toBe('completed');
      expect(s.finalLevel).toBe(2);
    });

    it('mixed: declared 2, passes 2-3-4 → finalLevel=4', () => {
      let s = startDiagnosis({
        declaredLevel: 2,
        maxLevel: 4,
        questionsPerLevel: 5,
      });
      s = passN(s, 5);
      s = passN(s, 5);
      s = passN(s, 5);
      expect(s.status).toBe('completed');
      expect(s.finalLevel).toBe(4);
    });
  });

  describe('guards', () => {
    it('throws when applying answer to a completed diagnosis', () => {
      let s = startDiagnosis({
        declaredLevel: 1,
        maxLevel: 4,
        questionsPerLevel: 5,
      });
      s = applyAnswer(s, { passed: false });
      expect(s.status).toBe('completed');
      expect(() => applyAnswer(s, { passed: true })).toThrow(/completed/);
    });
  });

  describe('scales to 9 levels', () => {
    it('uses binary search midpoint with maxLevel=9', () => {
      let s = startDiagnosis({
        declaredLevel: 5,
        maxLevel: 9,
        questionsPerLevel: 3,
      });
      expect(s.currentLevel).toBe(5);
      s = passN(s, 3);
      expect(s.floor).toBe(5);
      expect(s.currentLevel).toBe(7);
      s = applyAnswer(s, { passed: false });
      expect(s.ceiling).toBe(6);
      expect(s.currentLevel).toBe(6);
      s = passN(s, 3);
      expect(s.status).toBe('completed');
      expect(s.finalLevel).toBe(6);
    });

    it('maxLevel=9 lower midpoint math sanity', () => {
      const s = startDiagnosis({
        declaredLevel: 5,
        maxLevel: 9,
        questionsPerLevel: 3,
      });
      expect(s.ceiling).toBe(9);
      expect(s.currentLevel).toBe(5);
    });
  });
});
