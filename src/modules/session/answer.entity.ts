import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SessionEntity } from './session.entity';

@Entity('answers')
@Index(['session_id', 'step'], { unique: true })
export class AnswerEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'session_id', type: 'uuid' })
  session_id!: string;

  @ManyToOne(() => SessionEntity, (s) => s.answers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'session_id' })
  session?: SessionEntity;

  @Column({ name: 'question_id', type: 'int' })
  question_id!: number;

  @Column({ type: 'int' })
  step!: number;

  @Column({ name: 'tested_level', type: 'int' })
  tested_level!: number;

  @Column({ type: 'varchar', length: 100 })
  value!: string;

  @Column({ type: 'boolean' })
  passed!: boolean;

  @Column({ name: 'floor_after', type: 'int' })
  floor_after!: number;

  @Column({ name: 'ceiling_after', type: 'int' })
  ceiling_after!: number;

  @CreateDateColumn({ name: 'answered_at' })
  answered_at: Date;
}
