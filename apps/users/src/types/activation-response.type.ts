import { Field, ObjectType } from '@nestjs/graphql';
import { User } from '../entities/user.entity';
import { ErrorType } from './error.type';

@ObjectType()
export class ActivationResponseType {
  @Field(() => User)
  user: User | unknown;

  @Field(() => ErrorType, { nullable: true })
  error?: ErrorType;
}
