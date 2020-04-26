import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { ScrapeModule } from '../scrape/scrape.module';

@Module({
  imports: [ScrapeModule],
  providers: [TasksService]
})
export class TasksModule {}
