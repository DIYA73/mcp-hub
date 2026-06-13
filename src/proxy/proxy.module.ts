import { Module } from '@nestjs/common';
import { ProxyService } from './proxy.service';
import { ProxyController } from './proxy.controller';
import { ServersModule } from '../servers/servers.module';
import { LogsModule } from '../logs/logs.module';

@Module({
  imports: [ServersModule, LogsModule],
  providers: [ProxyService],
  controllers: [ProxyController],
})
export class ProxyModule {}
