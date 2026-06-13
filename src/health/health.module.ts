import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { HEALTH_QUEUE, HealthService } from './health.service';
import { HealthProcessor } from './health.processor';
import { HealthController } from './health.controller';
import { ServersModule } from '../servers/servers.module';

@Module({
  imports: [BullModule.registerQueue({ name: HEALTH_QUEUE }), ServersModule],
  providers: [HealthService, HealthProcessor],
  controllers: [HealthController],
})
export class HealthModule {}
