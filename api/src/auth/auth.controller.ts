import { BadRequestException, Body, Controller, FileTypeValidator, Get, HttpCode, HttpStatus, Logger, Param, ParseFilePipe, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserDto } from 'src/dto/userDto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from 'src/dto/loginDto';
import { FileInterceptor} from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import * as uniqid from 'uniqid';
import { FileSystemService } from 'src/posts/file-system/file-system.service';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService, private fileSystem: FileSystemService) { }



  @UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }))
  @UseInterceptors(FileInterceptor('photo', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.resolve(process.cwd(), 'uploads/user/profile');
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const nameArr = file.originalname.split('.')
        const extention = nameArr[nameArr.length - 1];
        const uniqId = uniqid();
        Logger.debug("auth controller ",uniqId);

        const uniqueName = `${uniqId}.${extention}`
        cb(null, uniqueName);
      },
    }),
  }))
  @Post('/create')
  async createUser(@UploadedFile(new ParseFilePipe({
    validators: [
      new FileTypeValidator({ fileType: 'image/jpeg' })
    ]
  })) file: Express.Multer.File,
    @Body() userData: UserDto, @Res() resp: Response) {

    try {

      if (!file) {
        throw new BadRequestException('File is required');
      }
      userData.photo = file.filename;
      const createUser = await this.authService.createUser(userData);
      resp.send({ ok: true, message: "User Created sussefully!", user: createUser });
    } catch (error) {
      resp.status(400).send({ ok: false, message: error.message });
    };
  };

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async singIn(@Body() singInDto: LoginDto, @Res() resp: Response) {
    try {
      const singInUser = await this.authService.login(singInDto.email, singInDto.password);
      resp.send({ ok: true, message: "Correct login!", user: singInUser })
    } catch (error) {
      resp.status(400).send({ ok: false, message: error.message });
    }
  }


  @Get('profile/:img')
  async getImgById(@Res() resp: Response, @Param('img') img: string) {
    try {
      const pathImage = await this.fileSystem.getImgProfileByUrl(img);
      if (!pathImage) {
        return resp.status(404).send({ ok: false, message: "Image not found" });
      }
      resp.sendFile(pathImage);

    } catch (error) {
      resp.status(500).send({ ok: false, message: "Internal Server Error" });
    }
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
