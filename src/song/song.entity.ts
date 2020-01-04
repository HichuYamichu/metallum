import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Album } from '../album/album.entity';

@Entity('songs')
@ObjectType()
export class Song {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id: string;

  @Column()
  @Field()
  title: string;

  @Column()
  @Field()
  length: string;

  @Column()
  @Field()
  lyrics: string;

  @ManyToOne(
    type => Album,
    album => album.songs,
  )
  album: Promise<Album>;
}
