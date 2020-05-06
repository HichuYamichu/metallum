import { NotFoundException } from '@nestjs/common';
import { Args, Query, Resolver, ResolveField, Root } from '@nestjs/graphql';
import { Band } from './band.entity';
import { AlbumService } from '../album/album.service';
import { BandService } from './band.service';
import { Album } from '../album/album.entity';
import { FindArgs } from '../common/dto/find.args';
import { BandInput } from './dto/band.args';
import { AlbumInput } from '../album/dto/album.dto';

@Resolver(of => Band)
export class BandResolver {
  public constructor(
    private readonly bandService: BandService,
    private readonly albumService: AlbumService
  ) {}

  @Query(returns => Band, { name: 'band' })
  public async band(@Args('id') id: string) {
    const band = await this.bandService.findOneById(id);
    if (!band) {
      throw new NotFoundException(`band with id: ${id} does not exist`);
    }
    return band;
  }

  @Query(returns => [Band], { name: 'bands' })
  public bands(
    @Args('where', { defaultValue: new BandInput() }) bandInput: BandInput,
    @Args() findArgs: FindArgs
  ) {
    return this.bandService.findWhere(bandInput, findArgs.skip, findArgs.take);
  }

  @ResolveField('albums', () => [Album])
  public resolveAlbums(
    @Root() band: Band,
    @Args('where', { defaultValue: new AlbumInput() }) albumInput: AlbumInput,
    @Args() findArgs: FindArgs
  ) {
    return this.albumService.findWhere(
      { bandID: band.id, ...albumInput },
      findArgs.skip,
      findArgs.take
    );
  }
}
