import { Module, forwardRef } from '@nestjs/common';
import { SongResolver } from './song.resolver';
import { SongService } from './song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { AlbumModule } from '../album/album.module';
import { AlbumService } from '../album/album.service';
import { Album } from '../album/album.entity';
import { SongController } from './song.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Album, Song]),
    forwardRef(() => AlbumModule)
  ],
  providers: [SongResolver, SongService, AlbumService],
  controllers: [SongController]
})
export class SongModule {}
