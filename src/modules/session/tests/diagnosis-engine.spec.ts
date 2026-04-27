import {
  AffirmativesAtLevel,
  applyAnswer,
  DIAGNOSIS_DEFAULTS,
  DiagnosisPhase,
  DiagnosisState,
  startDiagnosis,
} from '../diagnosis-engine';

const uniformCatalog = (perLevel: number): AffirmativesAtLevel => () => perLevel;

const passN = (
  state: DiagnosisState,
  n: number,
  catalog: AffirmativesAtLevel,
): DiagnosisState => {
  let s = state;
  for (let i = 0; i < n; i++) s = applyAnswer(s, { passed: true }, catalog);
  return s;
};

describe('diagnosis-engine', () => {
  describe('startDiagnosis', () => {
    it('initializes with MAX_LEVEL=9 by default', () => {
      const state = startDiagnosis({ declaredLevel: 5 });
      expect(state).toMatchObject({
        maxLevel: DIAGNOSIS_DEFAULTS.MAX_LEVEL,
        declaredLevel: 5,
        floor: 0,
        ceiling: 9,
        currentLevel: 5,
        currentLevelAnswered: 0,
        roadmapLevel: null,
        roadmapAnswered: 0,
        phase: DiagnosisPhase.SEARCH,
        finalLevel: null,
      });
    });

    it('rejects declaredLevel out of range', () => {
      expect(() => startDiagnosis({ declaredLevel: 0 })).toThrow(
        /declaredLevel/,
      );
      expect(() => startDiagnosis({ declaredLevel: 10 })).toThrow(
        /declaredLevel/,
      );
      expect(() => startDiagnosis({ declaredLevel: 1.5 })).toThrow(
        /declaredLevel/,
      );
    });

    it('accepts custom maxLevel', () => {
      const state = startDiagnosis({ declaredLevel: 2, maxLevel: 4 });
      expect(state.maxLevel).toBe(4);
      expect(state.ceiling).toBe(4);
    });
  });

  describe('search phase — climbing', () => {
    it('passes all affirmatives at probed level → narrows floor up', () => {
      const cat = uniformCatalog(3);
      let s = startDiagnosis({ declaredLevel: 5, maxLevel: 9 });
      s = passN(s, 3, cat);
      // floor=5, ceiling=9, midpoint=(5+1+9)/2=7
      expect(s.floor).toBe(5);
      expect(s.ceiling).toBe(9);
      expect(s.currentLevel).toBe(7);
      expect(s.currentLevelAnswered).toBe(0);
      expect(s.phase).toBe(DiagnosisPhase.SEARCH);
    });

    it('partial passes within a level keep the level open', () => {
      const cat = uniformCatalog(3);
      let s = startDiagnosis({ declaredLevel: 4, maxLevel: 9 });
      s = applyAnswer(s, { passed: true }, cat);
      expect(s.currentLevel).toBe(4);
      expect(s.currentLevelAnswered).toBe(1);
      expect(s.phase).toBe(DiagnosisPhase.SEARCH);
    });
  });

  describe('search phase — descending', () => {
    it('a single failure narrows ceiling immediately', () => {
      const cat = uniformCatalog(3);
      let s = startDiagnosis({ declaredLevel: 5, maxLevel: 9 });
      s = applyAnswer(s, { passed: false }, cat);
      // ceiling=4, floor=0, midpoint=(0+1+4)/2=2
      expect(s.floor).toBe(0);
      expect(s.ceiling).toBe(4);
      expect(s.currentLevel).toBe(2);
      expect(s.currentLevelAnswered).toBe(0);
    });

    it('failing level 1 with floor=0 finishes search at level 0', () => {
      const cat = uniformCatalog(3);
      let s = startDiagnosis({ declaredLevel: 1, maxLevel: 9 });
      s = applyAnswer(s, { passed: false }, cat);
      // floor=0, ceiling=0 → search done. Roadmap = level 1.
      expect(s.finalLevel).toBe(0);
      expect(s.phase).toBe(DiagnosisPhase.ROADMAP);
      expect(s.roadmapLevel).toBe(1);
    });
  });

  describe('search phase — convergence', () => {
    it('declared 5, passes 5, fails 7 → converges at 6', () => {
      const cat = uniformCatalog(3);
      let s = startDiagnosis({ declaredLevel: 5, maxLevel: 9 });
      s = passN(s, 3, cat);
      expect(s.currentLevel).toBe(7);
      s = applyAnswer(s, { passed: false }, cat);
      // floor=5, ceiling=6, midpoint=(5+1+6)/2=6
      expect(s.currentLevel).toBe(6);
      s = passN(s, 3, cat);
      // floor=6, ceiling=6 → search done.
      expect(s.finalLevel).toBe(6);
      expect(s.phase).toBe(DiagnosisPhase.ROADMAP);
      expect(s.roadmapLevel).toBe(7);
    });

    it('declared 1, passes everything up to MAX_LEVEL → completed without roadmap', () => {
      const cat = uniformCatalog(3);
      let s = startDiagnosis({ declaredLevel: 1, maxLevel: 9 });
      // Climb: 1→5→7→8→9
      s = passN(s, 3, cat);
      expect(s.currentLevel).toBe(5);
      s = passN(s, 3, cat);
      expect(s.currentLevel).toBe(7);
      s = passN(s, 3, cat);
      expect(s.currentLevel).toBe(8);
      s = passN(s, 3, cat);
      expect(s.currentLevel).toBe(9);
      s = passN(s, 3, cat);
      expect(s.phase).toBe(DiagnosisPhase.COMPLETED);
      expect(s.finalLevel).toBe(9);
      expect(s.roadmapLevel).toBeNull();
    });
  });

  describe('roadmap phase', () => {
    it('after convergence, enumerates all affirmatives at finalLevel+1 then completes', () => {
      const catalog: AffirmativesAtLevel = (level) => (level === 7 ? 5 : 3);
      let s = startDiagnosis({ declaredLevel: 5, maxLevel: 9 });
      // Force convergence at level 6: pass 5, fail 7, pass 6.
      s = passN(s, 3, catalog);
      s = applyAnswer(s, { passed: false }, catalog);
      s = passN(s, 3, catalog);
      expect(s.phase).toBe(DiagnosisPhase.ROADMAP);
      expect(s.roadmapLevel).toBe(7);
      expect(s.roadmapAnswered).toBe(0);

      // Now answer all 5 affirmatives of level 7 in the roadmap (mix yes/no
      // — engine doesn't care about pass/fail in roadmap, only counts).
      s = applyAnswer(s, { passed: true }, catalog);
      s = applyAnswer(s, { passed: false }, catalog);
      s = applyAnswer(s, { passed: false }, catalog);
      s = applyAnswer(s, { passed: true }, catalog);
      expect(s.phase).toBe(DiagnosisPhase.ROADMAP);
      expect(s.roadmapAnswered).toBe(4);

      s = applyAnswer(s, { passed: false }, catalog);
      expect(s.phase).toBe(DiagnosisPhase.COMPLETED);
      expect(s.finalLevel).toBe(6);
    });

    it('skips roadmap when finalLevel == maxLevel', () => {
      const cat = uniformCatalog(3);
      let s = startDiagnosis({ declaredLevel: 9, maxLevel: 9 });
      s = passN(s, 3, cat);
      expect(s.phase).toBe(DiagnosisPhase.COMPLETED);
      expect(s.finalLevel).toBe(9);
      expect(s.roadmapLevel).toBeNull();
    });
  });

  describe('guards', () => {
    it('throws when applying answer to a completed diagnosis', () => {
      const cat = uniformCatalog(3);
      let s = startDiagnosis({ declaredLevel: 9, maxLevel: 9 });
      s = passN(s, 3, cat);
      expect(s.phase).toBe(DiagnosisPhase.COMPLETED);
      expect(() => applyAnswer(s, { passed: true }, cat)).toThrow(/completed/);
    });
  });
});
