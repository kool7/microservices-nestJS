import { BadRequestException } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ActivationCodeDto } from './dto/activation-code.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { User } from './entities/user.entity';
import { ActivationResponseType } from './types/activation-response.type';
import { RegisterResponseType } from './types/register-response.type';
import { UsersService } from './users.service';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation(() => RegisterResponseType)
  async register(
    @Args('registerInput') registerUserDto: RegisterUserDto,
    @Context() context: { res: Response },
  ): Promise<RegisterResponseType> {
    if (
      !registerUserDto.name ||
      !registerUserDto.email ||
      !registerUserDto.password
    )
      throw new BadRequestException('Details missing');
    const { token } = await this.userService.register(
      registerUserDto,
      context.res,
    );
    return { token };
  }

  @Mutation(() => RegisterResponseType)
  async activateUser(
    @Args('activationInput') activationCodeDto: ActivationCodeDto,
    @Context() context: { res: Response },
  ): Promise<ActivationResponseType> {
    return await this.userService.activateUser(activationCodeDto, context.res);
  }

  @Query(() => [User])
  async getUsers() {
    return this.userService.getUsers();
  }
}
