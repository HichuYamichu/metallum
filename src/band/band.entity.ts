import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';
import { Album } from '../album/album.entity';

@Entity('bands')
@ObjectType()
export class Band {
  @PrimaryGeneratedColumn()
  @Field(type => ID)
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field()
  country: string;

  @Column()
  @Field()
  location: string;

  @Column({ name: 'formed_in' })
  @Field()
  formed: string;

  @Column()
  @Field()
  status: string;

  @Column()
  @Field()
  genre: string;

  @Column()
  @Field()
  themes: string;

  @Column()
  @Field()
  active: string;

  @OneToMany(
    type => Album,
    album => album.band,
  )
  @Field()
  albums: Promise<Album[]>;
}
