import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScrapeService } from './scrape.service';
import { Band } from '../band/band.entity';
import { HttpService } from './http.service';

@Module({
  imports: [TypeOrmModule.forFeature([Band]), HttpService],
  providers: [ScrapeService, HttpService],
  exports: [ScrapeService]
})
export class ScrapeModule {}
