import { NotFoundException } from '@nestjs/common';
import {
  Args,
  Query,
  Resolver,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Album } from './album.entity';
import { AlbumService } from './album.service';
import { Song } from '../song/song.entity';
import { Band } from 'src/band/band.entity';
import { FindArgs } from 'src/common/dto/find.args';

@Resolver(of => Album)
export class AlbumResolver {
  constructor(private readonly albumService: AlbumService) {}

  @Query(returns => Album, { name: 'album' })
  async album(@Args('id') id: number): Promise<Album> {
    const album = await this.albumService.findOneById(id);
    if (!album) {
      throw new NotFoundException(id);
    }
    return album;
  }

  @ResolveProperty('songs', () => [Song])
  async getSongs(@Parent() album: Album): Promise<Song[]> {
    const { id } = album;
    const { songs } = await this.albumService.findOneWithSongs(id);
    return songs;
  }

  @ResolveProperty('band', () => Band)
  async getBand(@Parent() album: Album): Promise<Band> {
    const { id } = album;
    const { band } = await this.albumService.findOneWithBand(id);
    return band;
  }

  @Query(returns => [Album], { name: 'albums' })
  albums(@Args() albumArgs?: FindArgs): Promise<Album[]> {
    return this.albumService.findWithSkipAndTake(
      albumArgs.skip,
      albumArgs.take,
    );
  }

  @Query(returns => [Album], { name: 'searchAlbum' })
  search(@Args('query') query: string): Promise<Album[]> {
    return this.albumService.search(query);
  }
}
