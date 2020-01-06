import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Song } from './song.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SongService {
  constructor(
    @InjectRepository(Song)
    private readonly songRepository: Repository<Song>,
  ) {}

  async findOneByID(id: number) {
    return this.songRepository.findOne(id);
  }

  async findOneWithAlbum(id: number) {
    return this.songRepository.findOne(id, { relations: ['album'] });
  }

  async findWithSkipAndTake(skip: number, take: number) {
    return this.songRepository.find({ skip, take });
  }

  async search(query: string) {
    return this.songRepository
      .createQueryBuilder()
      .select()
      .where('song_tsvector @@ plainto_tsquery(:query)', { query })
      .orderBy('ts_rank(song_tsvector, plainto_tsquery(:query))', 'DESC')
      .limit(25)
      .getMany();
  }
}
