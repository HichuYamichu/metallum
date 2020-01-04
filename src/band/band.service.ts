import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Band } from './band.entity';

@Injectable()
export class BandService {
  constructor(
    @InjectRepository(Band)
    private readonly bandRepository: Repository<Band>,
  ) {}

  async findOneById(id: string): Promise<Band> {
    const band = await this.bandRepository.findOne(id);
    return band;
  }

  async findAll(): Promise<Band[]> {
    return [] as Band[];
  }
}
