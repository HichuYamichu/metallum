import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  public constructor() {}

  @Timeout(1000)
  public async update() {
    this.logger.debug('Updating bands');
  }
}
