import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumResolver } from './album.resolver';
import { AlbumService } from './album.service';
import { Album } from './album.entity';
import { SongModule } from '../song/song.module';
import { SongService } from '../song/song.service';
import { Band } from '../band/band.entity';
import { Song } from '../song/song.entity';
import { BandModule } from '../band/band.module';
import { BandService } from '../band/band.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Band, Album, Song]),
    forwardRef(() => BandModule),
    SongModule
  ],
  providers: [AlbumResolver, BandService, AlbumService, SongService]
})
export class AlbumModule {}
