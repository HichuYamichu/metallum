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

  public findByBandID(id: string) {
    return this.albumRepository
      .createQueryBuilder('album')
      .select()
      .where('album.band_id = :id', { id })
      .getMany();
  }

  public async findOneWithBand(id: string) {
    return this.albumRepository.findOne(id, { relations: ['band'] });
  }

  public async findWithSkipAndTake(skip: number, take: number) {
    return this.albumRepository.find({ skip, take });
  }
}
