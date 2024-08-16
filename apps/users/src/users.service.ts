import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../../prisma/prisma.service';
import { ActivationCodeDto } from './dto/activation-code.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { RegisterUserDto } from './dto/register-user.dto';
import { EmailService } from './email/email.service';
import { UserInterface } from './interfaces/user.interface';

@Injectable()
export class UsersService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerUserDto: RegisterUserDto, response: Response) {
    const { name, email, password, phoneNumber } = registerUserDto;

    const isEmailRegistered = await this.prismaService.user.findUnique({
      where: { email },
    });
    if (isEmailRegistered)
      throw new BadRequestException('Email already exists.');

    const isRegisteredPhoneNumber = await this.prismaService.user.findMany({
      where: {
        phoneNumber: {
          not: null,
          in: [phoneNumber],
        },
      },
    });

    if (isRegisteredPhoneNumber)
      throw new BadRequestException('Phone number already exists.');

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phoneNumber,
    };

    const { activationCode, token } = await this.createActivationToken(user);

    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: './activation-mail',
      name,
      activationCode: activationCode,
    });

    return { token, response };
  }

  async login(loginUserto: LoginUserDto) {
    const { email, password } = loginUserto;
    const user = {};
    return user;
  }

  async getUsers() {
    this.prismaService.user.findMany();
  }

  async createActivationToken(user: UserInterface) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();
    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      { secret: this.configService.get<string>('JWT_SECRET'), expiresIn: '5m' },
    );

    return { token, activationCode };
  }

  async activateUser(activtionDto: ActivationCodeDto, response: Response) {
    const { activationCode } = activtionDto;

    const newUser: { user: UserInterface; activationCode: string } =
      this.jwtService.verify(activationCode, {
        secret: this.configService.get<string>('JWT_SECRET'),
      } as JwtVerifyOptions) as { user: UserInterface; activationCode: string };

    if (newUser.activationCode !== activationCode)
      throw new BadRequestException('Invalid activation code');

    const { name, email, password, phoneNumber } = newUser.user;

    const isExisting = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (isExisting)
      throw new BadRequestException('User already exist with this email');

    const user = await this.prismaService.user.create({
      data: {
        name,
        email,
        password,
        phoneNumber,
      },
    });
    return { user, response };
  }
}
