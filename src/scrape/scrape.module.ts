import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapeService } from './scrape.service';
import { Band } from '../band/band.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Band])],
  providers: [ScrapeService],
  exports: [ScrapeService]
})
export class ScrapeModule {}
