import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Song } from './song.entity';
import { SongService } from './song.service';
import { NotFoundException } from '@nestjs/common';
import { Album } from 'src/album/album.entity';
import { FindArgs } from 'src/common/dto/find.args';

@Resolver(of => Song)
export class SongResolver {
  constructor(private readonly songService: SongService) {}

  @Query(returns => Song, { name: 'song' })
  async song(@Args('id') id: number): Promise<Song> {
    const album = await this.songService.findOneByID(id);
    if (!album) {
      throw new NotFoundException(id);
    }
    return album;
  }

  @ResolveField('album', () => Album)
  async getBand(@Parent() song: Song): Promise<Album> {
    const { id } = song;
    const { album } = await this.songService.findOneWithAlbum(id);
    return album;
  }

  @Query(returns => [Song], { name: 'songs' })
  songs(@Args() songsArgs?: FindArgs): Promise<Song[]> {
    return this.songService.findWithSkipAndTake(songsArgs.skip, songsArgs.take);
  }

  @Query(returns => [Song], { name: 'searchSong' })
  search(@Args('query') query: string): Promise<Song[]> {
    return this.songService.search(query);
  }
}
