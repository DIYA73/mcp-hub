import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

@Entity('tool_call_logs')
@Index(['serverId', 'createdAt'])
export class ToolCallLog {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column() @Index()
  serverId!: string;

  @Column()
  serverName!: string;

  @Column()
  tool!: string;

  @Column({ type: 'jsonb' })
  input!: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  output!: unknown;

  @Column({ type: 'int' })
  durationMs!: number;

  @Column({ default: true })
  success!: boolean;

  @Column({ nullable: true, type: 'text' })
  error!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
