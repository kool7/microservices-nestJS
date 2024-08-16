import { Directive, Field, ObjectType } from '@nestjs/graphql';
import { Avatar } from './avatar.entity';

@ObjectType()
@Directive('@key(fields:"id")')
export class User {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => Avatar, { nullable: true })
  avatar?: Avatar | null;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}
