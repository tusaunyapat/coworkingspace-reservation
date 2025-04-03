import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { CoworkingspaceModule } from './coworkingspace/coworkingspace.module';
import { ReservationModule } from './reservation/reservation.module';

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
    AuthModule,
    UserModule,
    CoworkingspaceModule,
    ReservationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
