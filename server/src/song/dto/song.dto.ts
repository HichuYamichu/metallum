import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SongInput {
  @Field({ nullable: true })
  public title?: string;

  @Field({ nullable: true })
  public length?: string;

  @Field({ nullable: true })
  public lyrics?: string;

  @Field({ nullable: true })
  public albumID?: string;
}
