import { Controller, Get, Param, Query } from '@nestjs/common';
import { LogsService } from './logs.service';

@Controller('logs')
export class LogsController {
  constructor(private readonly service: LogsService) {}

  @Get()
  findAll(@Query('limit') limit?: string) {
    return this.service.findAll(limit ? parseInt(limit, 10) : 100);
  }

  @Get('server/:serverId')
  findByServer(@Param('serverId') serverId: string, @Query('limit') limit?: string) {
    return this.service.findByServer(serverId, limit ? parseInt(limit, 10) : 50);
  }
}
