import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ToolCallLog } from './log.entity';
import { LogsService } from './logs.service';
import { LogsController } from './logs.controller';
import { LogsGateway } from './logs.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([ToolCallLog])],
  providers: [LogsService, LogsGateway],
  controllers: [LogsController],
  exports: [LogsService],
})
export class LogsModule {}
