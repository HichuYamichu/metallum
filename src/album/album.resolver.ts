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
import { SongService } from '../song/song.service';

@Resolver(of => Album)
export class AlbumResolver {
  constructor(
    private readonly albumService: AlbumService,
    private readonly songService: SongService,
  ) {}

  @Query(returns => Album, { name: 'album' })
  async album(@Args('id') id: string): Promise<Album> {
    const album = await this.albumService.findOneById(id);
    if (!album) {
      throw new NotFoundException(id);
    }
    return album;
  }

  @ResolveProperty('songs')
  async getPosts(@Parent() album) {
    const { id } = album;
    return await this.songService.findAll();
  }

  @Query(returns => [Album])
  albums(): Promise<Album[]> {
    return this.albumService.findAll();
  }
}
