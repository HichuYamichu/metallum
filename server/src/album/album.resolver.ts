import { NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver, ResolveField, Root } from '@nestjs/graphql';
import { Album } from './album.entity';
import { BandService } from '../band/band.service';
import { AlbumService } from './album.service';
import { SongService } from '../song/song.service';
import { Song } from '../song/song.entity';
import { Band } from '../band/band.entity';
import { FindArgs } from '../common/dto/find.args';
import { AlbumInput } from './dto/album.dto';
import { SongInput } from '../song/dto/song.dto';

@Resolver(of => Album)
export class AlbumResolver {
  public constructor(
    private readonly bandService: BandService,
    private readonly albumService: AlbumService,
    private readonly songService: SongService
  ) {}

  @Query(returns => Album, { name: 'album' })
  public async album(@Args('id') id: string) {
    const album = await this.albumService.findOneById(id);
    if (!album) {
      throw new NotFoundException(`album with id: ${id} does not exist`);
    }
    return album;
  }

  @Query(returns => [Album], { name: 'albums' })
  public albums(
    @Args('where', { defaultValue: new AlbumInput() }) albumInput: AlbumInput,
    @Args() findArgs: FindArgs
  ) {
    return this.albumService.findWhere(
      albumInput,
      findArgs.skip,
      findArgs.take
    );
  }

  @ResolveField('songs', () => [Song])
  public resolveSongs(
    @Root() album: Album,
    @Args('where', { defaultValue: new SongInput() }) albumInput: SongInput,
    @Args() findArgs: FindArgs
  ) {
    return this.songService.findWhere(
      { albumID: album.id, ...albumInput },
      findArgs.skip,
      findArgs.take
    );
  }

  @ResolveField('band', () => Band)
  public resolveBand(@Root() album: Album) {
    return this.bandService.findOneById(album.bandID);
  }
}
