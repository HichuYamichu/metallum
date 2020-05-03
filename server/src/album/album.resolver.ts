import { NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Album } from './album.entity';
import { BandService } from '../band/band.service';
import { AlbumService } from './album.service';
import { SongService } from '../song/song.service';
import { Song } from '../song/song.entity';
import { Band } from '../band/band.entity';
import { FindArgs } from '../common/dto/find.args';

@Resolver(of => Album)
export class AlbumResolver {
  public constructor(
    private readonly bandService: BandService,
    private readonly albumService: AlbumService,
    private readonly songService: SongService
  ) {}

  @Query(returns => Album, { name: 'album' })
  public async album(@Args('id') id: string): Promise<Album> {
    const album = await this.albumService.findOneById(id);
    if (!album) {
      throw new NotFoundException(`album with id: ${id} does not exist`);
    }
    return album;
  }

  @ResolveField('songs', () => [Song])
  public getSongs(@Parent() album: Album): Promise<Song[]> {
    return this.songService.findByAlbumID(album.id);
  }

  @ResolveField('band', () => Band)
  public async getBand(@Parent() album: Album): Promise<Band> {
    return this.bandService.findOneById(album.bandID);
  }

  @Query(returns => [Album], { name: 'albums' })
  public albums(@Args() albumArgs?: FindArgs): Promise<Album[]> {
    return this.albumService.findWithSkipAndTake(
      albumArgs.skip,
      albumArgs.take
    );
  }
}
