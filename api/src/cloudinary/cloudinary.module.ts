import { Module } from '@nestjs/common';
import { CloudinaryProvider } from 'src/config/cloudinary.providers';
import { CloudinaryController } from './cloudinary.controller';
import { CloudinaryUploadFilesService } from './cloudinary-upload-files.service';

@Module({
  providers: [CloudinaryProvider,CloudinaryUploadFilesService],
  exports: [CloudinaryUploadFilesService],
  /* controllers: [CloudinaryController], */

})
export class CloudinaryModule {}
