import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumInput } from './dto/album.dto';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller()
export class AlbumController {
  public constructor(private readonly albumService: AlbumService) {}

  @Get('album/:id')
  @ApiParam({ name: 'id', type: 'string' })
  async album(@Param() params) {
    const album = await this.albumService.findOneById(params.id);
    if (!album) {
      throw new NotFoundException(`album with id: ${params.id} does not exist`);
    }
    return album;
  }

  @Get('albums')
  @ApiQuery({ name: 'skip', type: 'number', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  albums(@Query('skip') skip = 0, @Query('take') take = 25) {
    return this.albumService.findWhere(new AlbumInput(), skip, take);
  }
}
