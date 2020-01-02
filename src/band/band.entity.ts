import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Field, ID, ObjectType } from 'type-graphql';

@Entity()
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

  @Column()
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
}
