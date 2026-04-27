import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  AffirmativesAtLevel,
  applyAnswer,
  DiagnosisPhase,
  DiagnosisState,
  DIAGNOSIS_DEFAULTS,
  startDiagnosis,
} from './diagnosis-engine';
import { AnswerEntity } from './answer.entity';

@Entity('sessions')
export class SessionEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ name: 'declared_level', type: 'int' })
  declared_level!: number;

  @Column({
    name: 'max_level',
    type: 'int',
    default: DIAGNOSIS_DEFAULTS.MAX_LEVEL,
  })
  max_level!: number;

  @Column({ type: 'int' })
  floor!: number;

  @Column({ type: 'int' })
  ceiling!: number;

  @Column({ name: 'current_level', type: 'int' })
  current_level!: number;

  @Column({
    name: 'current_level_answered',
    type: 'int',
    default: 0,
  })
  current_level_answered!: number;

  @Column({ name: 'roadmap_level', type: 'int', nullable: true })
  roadmap_level!: number | null;

  @Column({ name: 'roadmap_answered', type: 'int', default: 0 })
  roadmap_answered!: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: DiagnosisPhase.SEARCH,
  })
  phase!: DiagnosisPhase;

  @Column({ name: 'final_level', type: 'int', nullable: true })
  final_level!: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => AnswerEntity, (a) => a.session)
  answers?: AnswerEntity[];

  toState(): DiagnosisState {
    return {
      maxLevel: this.max_level,
      declaredLevel: this.declared_level,
      floor: this.floor,
      ceiling: this.ceiling,
      currentLevel: this.current_level,
      currentLevelAnswered: this.current_level_answered,
      roadmapLevel: this.roadmap_level,
      roadmapAnswered: this.roadmap_answered,
      phase: this.phase,
      finalLevel: this.final_level,
    };
  }

  applyState(state: DiagnosisState): void {
    this.max_level = state.maxLevel;
    this.declared_level = state.declaredLevel;
    this.floor = state.floor;
    this.ceiling = state.ceiling;
    this.current_level = state.currentLevel;
    this.current_level_answered = state.currentLevelAnswered;
    this.roadmap_level = state.roadmapLevel;
    this.roadmap_answered = state.roadmapAnswered;
    this.phase = state.phase;
    this.final_level = state.finalLevel;
  }

  static start(declaredLevel: number, maxLevel?: number): SessionEntity {
    const state = startDiagnosis({ declaredLevel, maxLevel });
    const entity = new SessionEntity();
    entity.applyState(state);
    return entity;
  }

  answer(passed: boolean, affirmativesAtLevel: AffirmativesAtLevel): void {
    const next = applyAnswer(this.toState(), { passed }, affirmativesAtLevel);
    this.applyState(next);
  }
}
