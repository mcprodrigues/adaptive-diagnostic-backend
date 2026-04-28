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

export const KthDimension = {
  CRL: 'CRL',
  TRL: 'TRL',
  BRL: 'BRL',
  IPRL: 'IPRL',
  TMRL: 'TMRL',
  FRL: 'FRL',
} as const;
export type KthDimension = (typeof KthDimension)[keyof typeof KthDimension];

@Entity('levels')
@Index(['dimension', 'level_index'], { unique: true })
export class LevelEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 10, default: KthDimension.CRL })
  dimension!: KthDimension;

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
    if (!isNonEmptyString(this.dimension)) errors.push('dimension is required');
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
