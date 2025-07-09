import { Test, TestingModule } from '@nestjs/testing';
import { CloudinaryUploadFilesService } from './cloudinary-upload-files.service';

describe('CloudinaryUploadFilesService', () => {
  let service: CloudinaryUploadFilesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CloudinaryUploadFilesService],
    }).compile();

    service = module.get<CloudinaryUploadFilesService>(CloudinaryUploadFilesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
