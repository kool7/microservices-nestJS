import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

@InputType()
export class RegisterUserDto {
  @Field()
  @IsNotEmpty({ message: 'Name field is required' })
  @IsString({ message: 'Name must be a string' })
  name: string;

  @Field()
  @IsNotEmpty({ message: 'Password field is required' })
  @MinLength(8, { message: 'Minimum length must be 8 characters' })
  password: string;

  @Field()
  @IsNotEmpty({ message: 'Email field is required' })
  @IsEmail({}, { message: 'Email is invalid' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Phone number field is required' })
  phoneNumber: number;
}
