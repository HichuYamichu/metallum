import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Song } from '../song/song.entity';
import { Band } from '../band/band.entity';

@Entity()
@ObjectType()
export class Album {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  type: string;

  @Column()
  @Field()
  release: string;

  @Column()
  @Field({ nullable: true })
  catalog?: string;

  @OneToMany(
    type => Song,
    song => song.album,
  )
  @Field(type => [Song])
  songs: Song[];

  @ManyToOne(
    type => Band,
    band => band.albums,
  )
  @JoinColumn({ name: 'band_id' })
  @Field(type => Band)
  band: Band;

  @Column('tsvector', { select: false, name: 'album_tsvector' })
  albumTSVector: any;
}
