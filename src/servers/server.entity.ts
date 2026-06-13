import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import type { McpTransport, ServerStatus } from '../common/types';

@Entity('mcp_servers')
export class McpServer {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @Column()
  url!: string;

  @Column({ type: 'varchar', default: 'http' })
  transport!: McpTransport;

  @Column({ nullable: true, type: 'varchar' })
  description!: string | null;

  @Column({ type: 'varchar', default: 'unknown' })
  status!: ServerStatus;

  @Column({ nullable: true, type: 'varchar' })
  apiKey!: string | null;

  @Column({ default: true })
  enabled!: boolean;

  @Column({ nullable: true, type: 'timestamptz' })
  lastCheckedAt!: Date | null;

  @Column({ nullable: true, type: 'varchar' })
  lastError!: string | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
