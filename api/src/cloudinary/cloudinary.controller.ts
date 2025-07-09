import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { CloudinaryUploadFilesService } from './cloudinary-upload-files.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(private readonly uploadService: CloudinaryUploadFilesService) {};

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    const uploadedImage = await this.uploadService.uploadImage(file);
    return {
      url: uploadedImage.secure_url,
      public_id: uploadedImage.public_id,
    };
  }
}
