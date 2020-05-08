import { Resolver, Query, Args, ResolveField, Root } from '@nestjs/graphql';
import { Song } from './song.entity';
import { SongService } from './song.service';
import { NotFoundException } from '@nestjs/common';
import { Album } from '../album/album.entity';
import { FindArgs } from '../common/dto/find.args';
import { AlbumService } from '../album/album.service';
import { SongInput } from './dto/song.dto';

@Resolver(of => Song)
export class SongResolver {
  public constructor(
    private readonly albumService: AlbumService,
    private readonly songService: SongService
  ) {}

  @Query(returns => Song, { name: 'song' })
  public async song(@Args('id') id: string) {
    const album = await this.songService.findOneById(id);
    if (!album) {
      throw new NotFoundException(`song with id: ${id} does not exist`);
    }
    return album;
  }

  @Query(returns => [Song], { name: 'songs' })
  public songs(
    @Args('where', { defaultValue: new SongInput() }) songInput: SongInput,
    @Args() findArgs: FindArgs
  ) {
    return this.songService.findWhere(songInput, findArgs.skip, findArgs.take);
  }

  @ResolveField('album', () => Album)
  public resolveAlbum(@Root() song: Song) {
    return this.albumService.findOneById(song.albumID);
  }
}
