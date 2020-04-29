import {
  Entity,
  Column,
  PrimaryColumn,
  OneToMany,
  ManyToOne,
  JoinColumn
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Song } from '../song/song.entity';
import { Band } from '../band/band.entity';

@Entity()
@ObjectType()
export class Album {
  @PrimaryColumn({ type: 'character varying' })
  @Field(type => ID)
  public id: string;

  @Column()
  @Field()
  public title: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public type: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public release: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public catalog?: string;

  @OneToMany(type => Song, song => song.album, { cascade: true })
  @Field(type => [Song])
  public songs: Song[];

  @ManyToOne(type => Band, band => band.albums, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'band_id' })
  @Field(type => Band)
  public band: Band;

  @Column('tsvector', { select: false, name: 'album_tsvector', nullable: true })
  public albumTSVector?: any;
}
