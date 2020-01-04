import { ArgsType, Field } from 'type-graphql';

@ArgsType()
export class BandsArgs {
  @Field()
  name: string;

  @Field()
  country: string;

  @Field()
  genre: string;

  @Field()
  themes: string;
}
