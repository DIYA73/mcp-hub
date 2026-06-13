import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { McpServer } from './server.entity';
import type { CreateServerDto, UpdateServerDto } from './server.dto';
import type { ServerStatus } from '../common/types';

@Injectable()
export class ServersService {
  constructor(
    @InjectRepository(McpServer)
    private readonly repo: Repository<McpServer>,
  ) {}

  async create(dto: CreateServerDto): Promise<McpServer> {
    const existing = await this.repo.findOne({ where: { name: dto.name } });
    if (existing) throw new ConflictException(`Server "${dto.name}" already exists`);
    const server = this.repo.create({
      name: dto.name,
      url: dto.url,
      transport: dto.transport ?? 'http',
      description: dto.description ?? null,
      apiKey: dto.apiKey ?? null,
      enabled: dto.enabled ?? true,
      status: 'unknown',
    });
    return this.repo.save(server);
  }

  async findAll(): Promise<McpServer[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  async findOne(id: string): Promise<McpServer> {
    const server = await this.repo.findOne({ where: { id } });
    if (!server) throw new NotFoundException(`Server ${id} not found`);
    return server;
  }

  async update(id: string, dto: UpdateServerDto): Promise<McpServer> {
    const server = await this.findOne(id);
    Object.assign(server, dto);
    return this.repo.save(server);
  }

  async updateStatus(id: string, status: ServerStatus, error?: string): Promise<void> {
    await this.repo.update(id, { status, lastCheckedAt: new Date(), lastError: error ?? null });
  }

  async remove(id: string): Promise<void> {
    const server = await this.findOne(id);
    await this.repo.remove(server);
  }
}
