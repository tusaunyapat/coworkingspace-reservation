import { Module } from '@nestjs/common';
import { CoworkingspaceService } from './coworkingspace.service';
import { CoworkingspaceController } from './coworkingspace.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CoworkingspaceSchema } from './schemas/coworkingspace.schema';
import { Coworkingspace } from './schemas/coworkingspace.schema';
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Coworkingspace.name,
        schema: CoworkingspaceSchema,
      },
    ]),
  ],
  controllers: [CoworkingspaceController],
  providers: [CoworkingspaceService],
})
export class CoworkingspaceModule {}
