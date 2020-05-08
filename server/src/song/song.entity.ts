import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Album } from '../album/album.entity';
import { ApiHideProperty } from '@nestjs/swagger';

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
  @ApiHideProperty()
  public album: Album;

  @Column('tsvector', { select: false, name: 'song_tsvector', nullable: true })
  @ApiHideProperty()
  public songTSVector: any;
}
