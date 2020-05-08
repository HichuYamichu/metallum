import { Entity, Column, OneToMany, PrimaryColumn } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Album } from '../album/album.entity';
import { ApiHideProperty } from '@nestjs/swagger';

@Entity()
@ObjectType()
export class Band {
  @PrimaryColumn({ type: 'character varying' })
  @Field()
  public id: string;

  @Column()
  @Field()
  public name: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public description?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public country?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public location?: string;

  @Column({ name: 'formed_in', nullable: true })
  @Field({ nullable: true })
  public formed?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public status?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public genre?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public themes?: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  public active?: string;

  @OneToMany(type => Album, album => album.band)
  @Field(type => [Album])
  @ApiHideProperty()
  public albums: Album[];

  @Column('tsvector', { select: false, name: 'band_tsvector', nullable: true })
  @ApiHideProperty()
  public bandTSVector: any;
}
