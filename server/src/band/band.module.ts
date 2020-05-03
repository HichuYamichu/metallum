import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BandResolver } from './band.resolver';
import { BandService } from './band.service';
import { Band } from './band.entity';
import { AlbumService } from '../album/album.service';
import { AlbumModule } from '../album/album.module';
import { Album } from '../album/album.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Band, Album]), AlbumModule],
  providers: [BandResolver, BandService, AlbumService]
})
export class BandModule {}
