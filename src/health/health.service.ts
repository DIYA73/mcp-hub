import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import type { Queue } from 'bull';
import { ServersService } from '../servers/servers.service';

export const HEALTH_QUEUE = 'health-check';
export const HEALTH_JOB = 'ping-server';

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    @InjectQueue(HEALTH_QUEUE) private readonly queue: Queue,
    private readonly servers: ServersService,
  ) {}

  async scheduleAll(): Promise<void> {
    const servers = await this.servers.findAll();
    for (const server of servers) {
      if (!server.enabled) continue;
      await this.queue.add(HEALTH_JOB, { serverId: server.id }, { attempts: 2, backoff: { type: 'fixed', delay: 3000 } });
    }
    this.logger.log(`Queued health checks for ${servers.length} servers`);
  }

  async pingServer(serverId: string): Promise<void> {
    const server = await this.servers.findOne(serverId);
    try {
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (server.apiKey) headers['Authorization'] = `Bearer ${server.apiKey}`;
      const res = await fetch(server.url, { method: 'POST', headers, body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'ping', params: {} }), signal: AbortSignal.timeout(8_000) });
      await this.servers.updateStatus(serverId, res.ok ? 'healthy' : 'unhealthy', res.ok ? undefined : `HTTP ${res.status}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      await this.servers.updateStatus(serverId, 'unhealthy', message);
    }
  }
}
