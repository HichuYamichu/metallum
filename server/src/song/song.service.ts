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

  public findOneByID(id: string) {
    return this.songRepository.findOne(id);
  }

  public findByAlbumID(id: string) {
    return this.songRepository
      .createQueryBuilder('song')
      .select()
      .where('song.album_id = :id', { id })
      .getMany();
  }

  public async findWithSkipAndTake(skip: number, take: number) {
    return this.songRepository.find({ skip, take });
  }

  public findWhere(where: SongInput, skip: number, take: number) {
    return this.songRepository.find({ skip, take, where: { ...where } });
  }
}
