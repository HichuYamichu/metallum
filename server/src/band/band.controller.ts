import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query
} from '@nestjs/common';
import { BandService } from './band.service';
import { BandInput } from './dto/band.args';
import { ApiParam, ApiQuery } from '@nestjs/swagger';
import { FindArgs } from '../common/dto/find.args';

@Controller()
export class BandController {
  public constructor(private readonly bandService: BandService) {}

  @Get('band/:id')
  @ApiParam({ name: 'id', type: 'string' })
  async band(@Param() params) {
    const band = await this.bandService.findOneById(params.id);
    if (!band) {
      throw new NotFoundException(`band with id: ${params.id} does not exist`);
    }
    return band;
  }

  @Get('bands')
  @ApiQuery({ name: 'skip', type: 'number', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  bands(@Query('skip') skip = 0, @Query('take') take = 25) {
    return this.bandService.findWhere(new BandInput(), skip, take);
  }
}
