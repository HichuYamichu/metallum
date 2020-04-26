import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity';

@Injectable()
export class AlbumService {
  public constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>
  ) {}

  public async findOneById(id: string) {
    return this.albumRepository.findOne(id);
  }

  public async findOneWithSongs(id: string) {
    return this.albumRepository.findOne(id, { relations: ['songs'] });
  }

  public async findOneWithBand(id: string) {
    return this.albumRepository.findOne(id, { relations: ['band'] });
  }

  public async findWithSkipAndTake(skip: number, take: number) {
    return this.albumRepository.find({ skip, take });
  }

  public async search(query: string) {
    return this.albumRepository
      .createQueryBuilder()
      .select()
      .where('album_tsvector @@ plainto_tsquery(:query)', { query })
      .orderBy('ts_rank(album_tsvector, plainto_tsquery(:query))', 'DESC')
      .limit(25)
      .getMany();
  }
}
