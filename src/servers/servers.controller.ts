import { Controller, Get, Post, Patch, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ServersService } from './servers.service';
import { CreateServerDto, UpdateServerDto } from './server.dto';

@Controller('servers')
export class ServersController {
  constructor(private readonly service: ServersService) {}

  @Post()
  create(@Body() dto: CreateServerDto) { return this.service.create(dto); }

  @Get()
  findAll() { return this.service.findAll(); }

  @Get(':id')
  findOne(@Param('id') id: string) { return this.service.findOne(id); }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateServerDto) { return this.service.update(id, dto); }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) { return this.service.remove(id); }
}
