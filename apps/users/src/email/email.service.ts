import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { MailOptionsType } from '../types/mail.options.type';

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  async sendMail({
    subject,
    activationCode,
    email,
    name,
    template,
  }: MailOptionsType) {
    await this.mailerService.sendMail({
      to: email,
      subject,
      template,
      context: {
        name,
        activationCode,
      },
    });
  }
}
