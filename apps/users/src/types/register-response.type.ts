import { Field, ObjectType } from '@nestjs/graphql';
import { ErrorType } from './error.type';

@ObjectType()
export class RegisterResponseType {
  @Field()
  token: string;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType | null;
}
