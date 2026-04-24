import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import {
  applyAnswer,
  DiagnosisState,
  DiagnosisStatus,
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

  @Column({ type: 'int' })
  floor!: number;

  @Column({ type: 'int' })
  ceiling!: number;

  @Column({ name: 'current_level', type: 'int' })
  current_level!: number;

  @Column({
    name: 'max_level',
    type: 'int',
    default: DIAGNOSIS_DEFAULTS.MAX_LEVEL,
  })
  max_level!: number;

  @Column({
    name: 'questions_per_level',
    type: 'int',
    default: DIAGNOSIS_DEFAULTS.QUESTIONS_PER_LEVEL,
  })
  questions_per_level!: number;

  @Column({
    name: 'current_level_answered',
    type: 'int',
    default: 0,
  })
  current_level_answered!: number;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'in_progress',
  })
  status!: DiagnosisStatus;

  @Column({ name: 'final_level', type: 'int', nullable: true })
  final_level!: number | null;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updated_at: Date;

  @OneToMany(() => AnswerEntity, (a) => a.session)
  answers?: AnswerEntity[];

  toState(): DiagnosisState {
    const base = {
      floor: this.floor,
      ceiling: this.ceiling,
      currentLevel: this.current_level,
      maxLevel: this.max_level,
      questionsPerLevel: this.questions_per_level,
      currentLevelAnswered: this.current_level_answered,
    };
    if (this.status === DiagnosisStatus.COMPLETED) {
      return {
        ...base,
        status: DiagnosisStatus.COMPLETED,
        finalLevel: this.final_level!,
      };
    }
    return {
      ...base,
      status: DiagnosisStatus.IN_PROGRESS,
      finalLevel: null,
    };
  }

  applyState(state: DiagnosisState): void {
    this.floor = state.floor;
    this.ceiling = state.ceiling;
    this.current_level = state.currentLevel;
    this.max_level = state.maxLevel;
    this.questions_per_level = state.questionsPerLevel;
    this.current_level_answered = state.currentLevelAnswered;
    this.status = state.status;
    this.final_level = state.finalLevel;
  }

  static start(
    declaredLevel: number,
    maxLevel?: number,
    questionsPerLevel?: number,
  ): SessionEntity {
    const state = startDiagnosis({
      declaredLevel,
      maxLevel,
      questionsPerLevel,
    });
    const entity = new SessionEntity();
    entity.declared_level = declaredLevel;
    entity.applyState(state);
    return entity;
  }

  answer(passed: boolean): void {
    const next = applyAnswer(this.toState(), { passed });
    this.applyState(next);
  }
}
