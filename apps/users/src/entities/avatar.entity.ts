import { Directive, Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Directive('@key(fields:"id")')
export class Avatar {
  @Field()
  id: string;

  @Field()
  public_Id: string;

  @Field()
  url: string;

  @Field()
  userId: string;
}
