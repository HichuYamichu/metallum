import { Resolver, Query, Args, ResolveField, Parent } from '@nestjs/graphql';
import { Song } from './song.entity';
import { SongService } from './song.service';
import { NotFoundException } from '@nestjs/common';
import { Album } from '../album/album.entity';
import { FindArgs } from '../common/dto/find.args';
import { AlbumService } from '../album/album.service';

@Resolver(of => Song)
export class SongResolver {
  public constructor(
    private readonly albumService: AlbumService,
    private readonly songService: SongService
  ) {}

  @Query(returns => Song, { name: 'song' })
  public async song(@Args('id') id: string): Promise<Song> {
    const album = await this.songService.findOneByID(id);
    if (!album) {
      throw new NotFoundException(`song with id: ${id} does not exist`);
    }
    return album;
  }

  @ResolveField('album', () => Album)
  public getBand(@Parent() song: Song): Promise<Album> {
    return this.albumService.findOneById(song.albumID);
  }

  @Query(returns => [Song], { name: 'songs' })
  public songs(@Args() songsArgs?: FindArgs): Promise<Song[]> {
    return this.songService.findWithSkipAndTake(songsArgs.skip, songsArgs.take);
  }
}
