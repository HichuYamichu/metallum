import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Song } from './song.entity';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) {}

  async findOneById(id: string): Promise<Song> {
    return await this.songRepository.findOne(id);
  }

  async findByAlbumId(id: string): Promise<Song[]> {
    return await this.songRepository.find({ where: { band_id: id } });
  }

  async findAll(): Promise<Song[]> {
    return [] as Song[];
  }
}
