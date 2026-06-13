import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { McpServer } from './server.entity';
import { ServersService } from './servers.service';
import { ServersController } from './servers.controller';

@Module({
  imports: [TypeOrmModule.forFeature([McpServer])],
  providers: [ServersService],
  controllers: [ServersController],
  exports: [ServersService],
})
export class ServersModule {}
