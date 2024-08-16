import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class ActivationCodeDto {
  @Field()
  @IsNotEmpty({ message: 'Activation Token is required' })
  activationToken: string;

  @Field()
  @IsNotEmpty({ message: 'Activation Code is required' })
  activationCode: string;
}
