import {
  Controller,
  Get,
  Param,
  NotFoundException,
  Query
} from '@nestjs/common';
import { SongService } from './song.service';
import { SongInput } from './dto/song.dto';

@Controller()
export class SongController {
  public constructor(private readonly songService: SongService) {}

  @Get('song/:id')
  async song(@Param() params) {
    const song = await this.songService.findOneById(params.id);
    if (!song) {
      throw new NotFoundException(`song with id: ${params.id} does not exist`);
    }
    return song;
  }

  @Get('songs')
  songs(@Query('skip') skip, @Query('take') take) {
    return this.songService.findWhere(new SongInput(), skip, take);
  }
}
