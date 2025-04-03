import { Test, TestingModule } from '@nestjs/testing';
import { CoworkingspaceController } from './coworkingspace.controller';
import { CoworkingspaceService } from './coworkingspace.service';

describe('CoworkingspaceController', () => {
  let controller: CoworkingspaceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoworkingspaceController],
      providers: [CoworkingspaceService],
    }).compile();

    controller = module.get<CoworkingspaceController>(CoworkingspaceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
