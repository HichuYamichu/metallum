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

  async findOneById(id: string): Promise<Album> {
    const band = await this.albumRepository.findOne(id);
    return band;
  }

  async findByBandId(id: string): Promise<Album[]> {
    return await this.albumRepository.find({ where: { band_id: id } });
  }

  async findAll(): Promise<Album[]> {
    return [] as Album[];
  }
}
