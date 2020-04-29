import { Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { ScrapeService } from '../scrape/scrape.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  public constructor(private readonly scrapeService: ScrapeService) {}

  @Timeout(1000)
  public async update() {
    this.logger.debug('Updating bands');
    const updated = await this.scrapeService.updates();
    this.logger.debug(`Updated: ${updated} bands`);
  }

  // @Timeout(1000)
  // public async add() {
  //   this.logger.debug('Adding bands');
  //   const updated = await this.scrapeService.additions();
  //   this.logger.debug(`Added: ${updated} bands`);
  // }
}
