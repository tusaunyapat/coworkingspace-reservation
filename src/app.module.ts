import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CoworkingspaceModule } from './coworkingspace/coworkingspace.module';
import { ReservationModule } from './reservation/reservation.module';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    MongooseModule.forRoot(`mongodb://localhost:27017`, {
      user: 'admin',
      pass: 'secret',
      dbName: 'coworkingspace',
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.development.local', '.env.development', '.env'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MailModule,
    AuthModule,
    UserModule,
    CoworkingspaceModule,
    ReservationModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET, // Load secret from environment variable
      signOptions: { expiresIn: '1h' }, // You can set a default expiration if needed
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
