import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import {
  isNonEmptyString,
  isPositiveNumber,
} from 'src/shared/utils/validations';
import { AppError } from 'src/shared/errors/app-error';
import { QuestionEntity } from './question.entity';

@Entity('levels')
export class LevelEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index({ unique: true })
  @Column({ name: 'level_index', type: 'int' })
  level_index!: number;

  @Column({ type: 'varchar', length: 120 })
  name!: string;

  @Column({ type: 'text' })
  description!: string;

  @CreateDateColumn({ name: 'created_at' })
  created_at: Date;

  @OneToMany(() => QuestionEntity, (q) => q.level)
  questions?: QuestionEntity[];

  validate(): void {
    const errors: string[] = [];
    if (!isPositiveNumber(this.level_index)) {
      errors.push('level_index must be a positive integer');
    }
    if (!isNonEmptyString(this.name)) errors.push('name is required');
    if (!isNonEmptyString(this.description))
      errors.push('description is required');
    if (errors.length) {
      throw new AppError(`Level validation failed: ${errors.join('; ')}.`, 400);
    }
  }
}
