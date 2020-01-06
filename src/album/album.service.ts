import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>,
  ) {}

  async findOneById(id: number) {
    return this.albumRepository.findOne(id);
  }

  async findOneWithSongs(id: number) {
    return this.albumRepository.findOne(id, { relations: ['songs'] });
  }

  async findOneWithBand(id: number) {
    return this.albumRepository.findOne(id, { relations: ['band'] });
  }

  async findWithSkipAndTake(skip: number, take: number) {
    return this.albumRepository.find({ skip, take });
  }

  async search(query: string) {
    return this.albumRepository
      .createQueryBuilder()
      .select()
      .where('album_tsvector @@ plainto_tsquery(:query)', { query })
      .orderBy('ts_rank(album_tsvector, plainto_tsquery(:query))', 'DESC')
      .limit(25)
      .getMany();
  }
}
