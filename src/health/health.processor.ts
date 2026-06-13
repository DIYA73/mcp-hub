import { Process, Processor } from '@nestjs/bull';
import type { Job } from 'bull';
import { Logger } from '@nestjs/common';
import { HEALTH_QUEUE, HEALTH_JOB, HealthService } from './health.service';

interface HealthJobData { serverId: string; }

@Processor(HEALTH_QUEUE)
export class HealthProcessor {
  private readonly logger = new Logger(HealthProcessor.name);
  constructor(private readonly healthService: HealthService) {}

  @Process(HEALTH_JOB)
  async handle(job: Job<HealthJobData>): Promise<void> {
    this.logger.debug(`Pinging server ${job.data.serverId}`);
    await this.healthService.pingServer(job.data.serverId);
  }
}
