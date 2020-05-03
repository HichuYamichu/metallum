import { NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Band } from './band.entity';
import { AlbumService } from '../album/album.service';
import { BandService } from './band.service';
import { Album } from '../album/album.entity';
import { FindArgs } from '../common/dto/find.args';
import { BandArgs } from './dto/band.args';

@Resolver(of => Band)
export class BandResolver {
  public constructor(
    private readonly bandService: BandService,
    private readonly albumService: AlbumService
  ) {}

  @Query(returns => Band, { name: 'band' })
  public async band(@Args('id') id: string): Promise<Band> {
    const band = await this.bandService.findOneById(id);
    if (!band) {
      throw new NotFoundException(`band with id: ${id} does not exist`);
    }
    return band;
  }

  @Query(returns => [Band], { name: 'bands' })
  public bands(@Args() bandsArgs?: FindArgs): Promise<Band[]> {
    return this.bandService.findWithSkipAndTake(bandsArgs.skip, bandsArgs.take);
  }

  @Query(returns => [Band], { name: 'bandWhere' })
  public search(@Args() bandArgs: BandArgs): Promise<Band[]> {
    return this.bandService.findWhere(bandArgs);
  }

  @ResolveField('albums', () => [Album])
  public getAlbums(@Parent() band: Band): Promise<Album[]> {
    return this.albumService.findByBandID(band.id);
  }
}
