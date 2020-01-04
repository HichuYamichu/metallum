import { NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Song } from './song.entity';
import { SongService } from './song.service';

@Resolver(of => Song)
export class SongResolver {
  constructor(private readonly songService: SongService) {}

  @Query(returns => Song, { name: 'song' })
  async song(@Args('id') id: string): Promise<Song> {
    const band = await this.songService.findOneById(id);
    if (!band) {
      throw new NotFoundException(id);
    }
    return band;
  }

  @Query(returns => [Song])
  songs(): Promise<Song[]> {
    return this.songService.findAll();
  }
}
