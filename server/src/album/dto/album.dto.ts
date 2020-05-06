import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AlbumInput {
  @Field({ nullable: true })
  public title?: string;

  @Field({ nullable: true })
  public type?: string;

  @Field({ nullable: true })
  public release?: string;

  @Field({ nullable: true })
  public catalog?: string;

  @Field({ nullable: true })
  public bandID?: string;
}
