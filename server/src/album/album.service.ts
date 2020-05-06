import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Album } from './album.entity';
import { AlbumInput } from './dto/album.dto';

@Injectable()
export class AlbumService {
  public constructor(
    @InjectRepository(Album)
    private readonly albumRepository: Repository<Album>
  ) {}

  public findOneById(id: string) {
    return this.albumRepository.findOne(id);
  }

  public findWhere(where: AlbumInput, skip: number, take: number) {
    return this.albumRepository.find({ skip, take, where: { ...where } });
  }
}
