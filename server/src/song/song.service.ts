import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Repository } from 'typeorm';
import { SongInput } from './dto/song.dto';

@Injectable()
export class SongService {
  public constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>
  ) {}

  public findOneById(id: string) {
    return this.songRepository.findOne(id);
  }

  public findWhere(where: SongInput, skip: number, take: number) {
    return this.songRepository.find({ skip, take, where: { ...where } });
  }
}
