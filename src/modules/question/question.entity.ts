import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  isNonEmptyString,
  isPositiveNumber,
} from 'src/shared/utils/validations';
import { AppError } from 'src/shared/errors/app-error';
import { QuestionType } from './enums/question-type.enum';
import { LevelEntity } from './level.entity';

export interface QuestionOption {
  value: string;
  label: string;
  passes: boolean;
}

@Entity('questions')
@Index(['level_id', 'order_in_level'], { unique: true })
export class QuestionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'level_id', type: 'int' })
  level_id!: number;

  @ManyToOne(() => LevelEntity, (l) => l.questions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'level_id' })
  level?: LevelEntity;

  @Column({ type: 'text' })
  text!: string;

  @Column({ type: 'enum', enum: QuestionType, default: QuestionType.BOOLEAN })
  question_type!: QuestionType;

  @Column({ name: 'order_in_level', type: 'int' })
  order_in_level!: number;

  @Column({ type: 'jsonb' })
  options!: QuestionOption[];

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  validate(): void {
    const errors: string[] = [];
    if (!isPositiveNumber(this.level_id)) {
      errors.push('level_id must be a positive integer');
    }
    if (!isNonEmptyString(this.text)) errors.push('text is required');
    if (!isPositiveNumber(this.order_in_level)) {
      errors.push('order_in_level must be a positive integer');
    }
    if (!Array.isArray(this.options) || this.options.length < 2) {
      errors.push('options must be an array with at least 2 items');
    } else if (!this.options.some((o) => o.passes)) {
      errors.push('options must contain at least one passing option');
    }
    if (errors.length) {
      throw new AppError(
        `Question validation failed: ${errors.join('; ')}.`,
        400,
      );
    }
  }

  evaluate(value: string): boolean {
    const match = this.options.find((o) => o.value === value);
    if (!match) {
      throw new AppError(
        `Invalid value "${value}" for question ${this.id}.`,
        400,
      );
    }
    return match.passes;
  }
}
