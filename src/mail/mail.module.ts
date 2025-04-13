// src/mail/mail.module.ts
import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [ConfigModule, JwtModule.register({})], // import ConfigModule here
  providers: [MailService],
  exports: [MailService], // make MailService available to other modules
})
export class MailModule {}
