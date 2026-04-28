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
import { LevelEntity } from './level.entity';

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

  @Column({ name: 'order_in_level', type: 'int' })
  order_in_level!: number;

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
    if (errors.length) {
      throw new AppError(
        `Question validation failed: ${errors.join('; ')}.`,
        400,
      );
    }
  }
}
