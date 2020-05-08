import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumInput } from './dto/album.dto';

@Controller()
export class AlbumController {
  public constructor(private readonly albumService: AlbumService) {}

  @Get('album/:id')
  async album(@Param() params) {
    const album = await this.albumService.findOneById(params.id);
    if (!album) {
      throw new NotFoundException(`album with id: ${params.id} does not exist`);
    }
    return album;
  }

  @Get('albums')
  albums(@Query('skip') skip, @Query('take') take) {
    return this.albumService.findWhere(new AlbumInput(), skip, take);
  }
}
