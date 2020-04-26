import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class FindArgs {
  @Field(type => Int)
  @Min(0)
  public skip = 0;

  @Field(type => Int)
  @Min(1)
  @Max(50)
  public take = 25;
}
