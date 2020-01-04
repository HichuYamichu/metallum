import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BandResolver } from './band.resolver';
import { BandService } from './band.service';
import { AlbumService } from '../album/album.service';
import { Band } from './band.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Band]), AlbumService],
  providers: [BandResolver, BandService],
})
export class BandModule {}
