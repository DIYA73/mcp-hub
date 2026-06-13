import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { ProxyService, CallToolDto } from './proxy.service';

@Controller('proxy')
export class ProxyController {
  constructor(private readonly service: ProxyService) {}

  @Get(':serverId/tools')
  listTools(@Param('serverId') serverId: string) { return this.service.listTools(serverId); }

  @Post(':serverId/call')
  callTool(@Param('serverId') serverId: string, @Body() dto: CallToolDto) { return this.service.callTool(serverId, dto); }
}
