import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Song } from '../song/song.entity';
import { Band } from '../band/band.entity';

@Entity('albums')
@ObjectType()
export class Album {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  type: string;

  @Column()
  @Field()
  release: string;

  @Column()
  @Field()
  catalog: string;

  @OneToMany(
    type => Song,
    song => song.album,
  )
  songs: Promise<Song[]>;

  @ManyToOne(
    type => Band,
    band => band.albums,
  )
  band: Promise<Band>;
}
