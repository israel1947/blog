import { Injectable } from '@nestjs/common';
import * as path from 'path'
import * as fs from 'fs';

@Injectable()
export class FileSystemService {
  async getImgByUrl(img: string) {
    const pathImage = path.resolve(__dirname, '../../../uploads', img);
    const exist = fs.existsSync(pathImage);
    if (!exist) {
      console.log("Error: the image does not exist");
      return null;
    }
    return pathImage;
  }
}
