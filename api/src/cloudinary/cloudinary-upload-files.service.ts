import { Inject, Injectable } from '@nestjs/common';
import { UploadApiOptions, UploadApiResponse } from 'cloudinary';


@Injectable()
export class CloudinaryUploadFilesService {
  constructor(@Inject('CLOUDINARY') private cloudinary) {}

  async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload_stream(
        {
          folder: 'uploads', 
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        },
      ).end(file.buffer);
    });
  }
}
