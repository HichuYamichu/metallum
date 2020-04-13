import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Album } from '../album/album.entity';

@Entity()
@ObjectType()
export class Band {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id: number;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  country: string;

  @Column()
  @Field({ nullable: true })
  location?: string;

  @Column({ name: 'formed_in' })
  @Field({ nullable: true })
  formed?: string;

  @Column()
  @Field()
  status: string;

  @Column()
  @Field()
  genre: string;

  @Column()
  @Field({ nullable: true })
  themes?: string;

  @Column()
  @Field({ nullable: true })
  active?: string;

  @OneToMany(type => Album, album => album.band)
  @Field(type => [Album])
  albums: Album[];

  @Column('tsvector', { select: false, name: 'band_tsvector' })
  bandTSVector: any;
}
