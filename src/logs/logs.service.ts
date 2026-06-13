import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectRedis } from '@nestjs-modules/ioredis';
import type { Redis } from 'ioredis';
import { ToolCallLog } from './log.entity';

export const LOG_CHANNEL = 'mcp:tool-calls';

export interface CreateLogDto {
  serverId: string;
  serverName: string;
  tool: string;
  input: Record<string, unknown>;
  output: unknown;
  durationMs: number;
  success: boolean;
  error?: string;
}

@Injectable()
export class LogsService {
  constructor(
    @InjectRepository(ToolCallLog)
    private readonly repo: Repository<ToolCallLog>,
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async record(dto: CreateLogDto): Promise<ToolCallLog> {
    const log = this.repo.create({
      serverId: dto.serverId,
      serverName: dto.serverName,
      tool: dto.tool,
      input: dto.input,
      output: dto.output ?? null,
      durationMs: dto.durationMs,
      success: dto.success,
      error: dto.error ?? null,
    });
    const saved = await this.repo.save(log);
    await this.redis.publish(LOG_CHANNEL, JSON.stringify(saved));
    return saved;
  }

  async findByServer(serverId: string, limit = 50): Promise<ToolCallLog[]> {
    return this.repo.find({ where: { serverId }, order: { createdAt: 'DESC' }, take: limit });
  }

  async findAll(limit = 100): Promise<ToolCallLog[]> {
    return this.repo.find({ order: { createdAt: 'DESC' }, take: limit });
  }
}
