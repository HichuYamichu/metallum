import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Band } from './band.entity';

@Injectable()
export class BandService {
  public constructor(
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>
  ) {}

  public async findOneById(id: string) {
    return this.bandRepository.findOne(id);
  }

  public async findOneWithAlbums(id: string) {
    return this.bandRepository.findOne(id, {
      relations: ['albums']
    });
  }

  public async findWithSkipAndTake(skip: number, take: number) {
    return this.bandRepository.find({ skip, take });
  }

  public async search(query: string) {
    return this.bandRepository
      .createQueryBuilder()
      .select()
      .where('band_tsvector @@ plainto_tsquery(:query)', { query })
      .orderBy('ts_rank(band_tsvector, plainto_tsquery(:query))', 'DESC')
      .limit(25)
      .getMany();
  }
}
