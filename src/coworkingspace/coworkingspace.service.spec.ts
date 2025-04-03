import { Test, TestingModule } from '@nestjs/testing';
import { CoworkingspaceService } from './coworkingspace.service';

describe('CoworkingspaceService', () => {
  let service: CoworkingspaceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CoworkingspaceService],
    }).compile();

    service = module.get<CoworkingspaceService>(CoworkingspaceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
