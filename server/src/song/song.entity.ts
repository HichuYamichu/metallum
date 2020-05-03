import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Album } from '../album/album.entity';

@Entity()
@ObjectType()
export class Song {
  @PrimaryColumn({ type: 'character varying' })
  @Field()
  public id: string;

  @Column()
  @Field()
  public title: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public length?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public lyrics?: string;

  @Column({ name: 'album_id' })
  albumID: string;

  @ManyToOne(type => Album, album => album.songs)
  @JoinColumn({ name: 'album_id' })
  @Field(type => Album)
  public album: Album;

  @Column('tsvector', { select: false, name: 'song_tsvector', nullable: true })
  public songTSVector: any;
}
