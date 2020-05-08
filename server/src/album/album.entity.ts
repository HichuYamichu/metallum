import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Song } from '../song/song.entity';
import { Band } from '../band/band.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
@ObjectType()
export class Album {
  @PrimaryColumn({ type: 'character varying' })
  @Field()
  public id: string;

  @Column()
  @Field()
  public title: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public type?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public release?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public catalog?: string;

  @OneToMany(type => Song, song => song.album)
  @Field(type => [Song])
  @ApiHideProperty()
  public songs: Song[];

  @Column({ name: 'band_id' })
  bandID: string;

  @ManyToOne(type => Band, band => band.albums)
  @JoinColumn({ name: 'band_id' })
  @Field(type => Band)
  @ApiHideProperty()
  public band: Band;

  @Column('tsvector', { select: false, name: 'album_tsvector', nullable: true })
  @ApiHideProperty()
  public albumTSVector?: any;
}
