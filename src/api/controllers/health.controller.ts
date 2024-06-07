import { Controller, Get, Logger } from '@nestjs/common';

@Controller('app')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  constructor() {}

  @Get('/GetHealthCheckStatus')
  getHealthCheckStatus(): { status: boolean } {
    this.logger.debug('Health Check OK');
    return { status: true };
  }
}
