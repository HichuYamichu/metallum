import { NotFoundException } from '@nestjs/common';
import {
  Args,
  Query,
  Resolver,
  ResolveProperty,
  Parent,
} from '@nestjs/graphql';
import { Band } from './band.entity';
import { BandService } from './band.service';
import { AlbumService } from '../album/album.service';
import { SearchArgs } from './dto/search.args';
import { BandsArgs } from './dto/bands.args';

@Resolver(of => Band)
export class BandResolver {
  constructor(
    private readonly bandService: BandService,
    private readonly albumService: AlbumService,
  ) {}

  @Query(returns => Band, { name: 'band' })
  async band(@Args('id') id: string): Promise<Band> {
    const band = await this.bandService.findOneById(id);
    if (!band) {
      throw new NotFoundException(id);
    }
    return band;
  }

  @ResolveProperty('albums')
  async getAlbums(@Parent() band) {
    const { id } = band;
    return await this.albumService.findByBandId(id);
  }

  @Query(returns => [Band])
  bands(@Args() bandsArgs: BandsArgs): Promise<Band[]> {
    return this.bandService.findAll();
  }

  @Query(returns => [Band])
  search(@Args() searchArgs: SearchArgs): Promise<Band[]> {
    return this.bandService.findAll();
  }
}
