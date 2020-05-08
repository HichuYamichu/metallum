import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query
} from '@nestjs/common';
import { BandService } from './band.service';
import { BandInput } from './dto/band.args';

@Controller()
export class BandController {
  public constructor(private readonly bandService: BandService) {}

  @Get('band/:id')
  async band(@Param() params) {
    const band = await this.bandService.findOneById(params.id);
    if (!band) {
      throw new NotFoundException(`band with id: ${params.id} does not exist`);
    }
    return band;
  }

  @Get('bands')
  bands(@Query('skip') skip, @Query('take') take) {
    return this.bandService.findWhere(new BandInput(), skip, take);
  }
}
