import { Controller, Post, Get, Param } from '@nestjs/common';
import { HealthService } from './health.service';
import { ServersService } from '../servers/servers.service';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService, private readonly servers: ServersService) {}

  @Post('check-all')
  checkAll() { return this.healthService.scheduleAll(); }

  @Post('check/:serverId')
  async checkOne(@Param('serverId') serverId: string) {
    await this.healthService.pingServer(serverId);
    return this.servers.findOne(serverId);
  }

  @Get('status')
  async status() {
    const servers = await this.servers.findAll();
    return {
      total: servers.length,
      healthy: servers.filter(s => s.status === 'healthy').length,
      unhealthy: servers.filter(s => s.status === 'unhealthy').length,
      unknown: servers.filter(s => s.status === 'unknown').length,
    };
  }
}
