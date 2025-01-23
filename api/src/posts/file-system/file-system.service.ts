import { Injectable, Logger } from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs';

@Injectable()
export class FileSystemService {
  async getImgByUrl(img: string) {
    const pathImage = path.resolve(process.cwd(), 'uploads', img);
    const exist = fs.existsSync(pathImage);
    if (!exist) {
      Logger.debug(pathImage)
      Logger.error("Error: the image does not exist!!!!");
      return null;
    }
    return pathImage;
  };

  async getImgProfileByUrl(img: string) {
    const pathImage = path.resolve(process.cwd(), 'uploads/user/profile', img);
    const exist = fs.existsSync(pathImage);
    if (!exist) {
      Logger.error("Error: the image does not exist");
      return null;
    }
    return pathImage;
  }
}
