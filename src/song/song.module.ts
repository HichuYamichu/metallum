import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongResolver } from './song.resolver';
import { SongService } from './song.service';
import { Song } from './song.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Song])],
  providers: [SongResolver, SongService],
})
export class SongModule {}
