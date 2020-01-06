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
import { Album } from '../album/album.entity';
import { FindArgs } from 'src/common/dto/find.args';

@Resolver(of => Band)
export class BandResolver {
  constructor(private readonly bandService: BandService) {}

  @Query(returns => Band, { name: 'band' })
  async band(@Args('id') id: number): Promise<Band> {
    const band = await this.bandService.findOneById(id);
    if (!band) {
      throw new NotFoundException(id);
    }
    return band;
  }

  @ResolveProperty('albums', () => [Album])
  async getAlbums(@Parent() band: Band): Promise<Album[]> {
    const { id } = band;
    const { albums } = await this.bandService.findOneWithAlbums(id);
    return albums;
  }

  @Query(returns => [Band], { name: 'bands' })
  bands(@Args() bandsArgs?: FindArgs): Promise<Band[]> {
    return this.bandService.findWithSkipAndTake(bandsArgs.skip, bandsArgs.take);
  }

  @Query(returns => [Band], { name: 'searchBand' })
  search(@Args('query') query: string): Promise<Band[]> {
    return this.bandService.search(query);
  }
}
