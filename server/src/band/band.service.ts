import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Band } from './band.entity';
import { BandInput } from './dto/band.args';

@Injectable()
export class BandService {
  public constructor(
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>
  ) {}

  public findOneById(id: string) {
    return this.bandRepository.findOne(id);
  }

  public findWhere(where: BandInput, skip: number, take: number) {
    return this.bandRepository.find({ skip, take, where: { ...where } });
  }
}
