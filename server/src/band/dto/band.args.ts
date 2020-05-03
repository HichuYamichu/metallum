import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class BandArgs {
  @Field({ nullable: true })
  public name: string;

  @Field({ nullable: true })
  public country?: string;

  @Field({ nullable: true })
  public location?: string;

  @Field({ nullable: true })
  public formed?: string;

  @Field({ nullable: true })
  public status?: string;

  @Field({ nullable: true })
  public genre?: string;

  @Field({ nullable: true })
  public themes?: string;

  @Field({ nullable: true })
  public active?: string;
}
