import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query
} from '@nestjs/common';
import { SongService } from './song.service';
import { SongInput } from './dto/song.dto';
import { ApiParam, ApiQuery } from '@nestjs/swagger';

@Controller()
export class SongController {
  public constructor(private readonly songService: SongService) {}

  @Get('song/:id')
  @ApiParam({ name: 'id', type: 'string' })
  async song(@Param() params) {
    const song = await this.songService.findOneById(params.id);
    if (!song) {
      throw new NotFoundException(`song with id: ${params.id} does not exist`);
    }
    return song;
  }

  @Get('songs')
  @ApiQuery({ name: 'skip', type: 'number', required: false })
  @ApiQuery({ name: 'take', type: 'number', required: false })
  songs(@Query('skip') skip = 0, @Query('take') take = 25) {
    return this.songService.findWhere(new SongInput(), skip, take);
  }
}
