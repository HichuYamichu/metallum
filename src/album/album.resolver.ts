import { NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Album } from './album.entity';
import { AlbumService } from './album.service';
import { Song } from '../song/song.entity';
import { Band } from '../band/band.entity';
import { FindArgs } from '../common/dto/find.args';

@Resolver(of => Album)
export class AlbumResolver {
  public constructor(private readonly albumService: AlbumService) {}

  @Query(returns => Album, { name: 'album' })
  public async album(@Args('id') id: string): Promise<Album> {
    const album = await this.albumService.findOneById(id);
    if (!album) {
      throw new NotFoundException(id);
    }
    return album;
  }

  @ResolveField('songs', () => [Song])
  public async getSongs(@Parent() album: Album): Promise<Song[]> {
    const { id } = album;
    const { songs } = await this.albumService.findOneWithSongs(id);
    return songs;
  }

  @ResolveField('band', () => Band)
  public async getBand(@Parent() album: Album): Promise<Band> {
    const { id } = album;
    const { band } = await this.albumService.findOneWithBand(id);
    return band;
  }

  @Query(returns => [Album], { name: 'albums' })
  public albums(@Args() albumArgs?: FindArgs): Promise<Album[]> {
    return this.albumService.findWithSkipAndTake(
      albumArgs.skip,
      albumArgs.take
    );
  }

  @Query(returns => [Album], { name: 'searchAlbum' })
  public search(@Args('query') query: string): Promise<Album[]> {
    return this.albumService.search(query);
  }
}
