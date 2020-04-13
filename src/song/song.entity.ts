import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Album } from '../album/album.entity';

@Entity()
@ObjectType()
export class Song {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id: number;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field({ nullable: true })
  length?: string;

  @Column()
  @Field({ nullable: true })
  lyrics?: string;

  @ManyToOne(type => Album, album => album.songs)
  @JoinColumn({ name: 'album_id' })
  @Field(type => Album)
  album: Album;

  @Column('tsvector', { select: false, name: 'song_tsvector' })
  songTSVector: any;
}
