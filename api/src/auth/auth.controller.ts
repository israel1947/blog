import { BadRequestException, Body, Controller, FileTypeValidator, Get, HttpCode, HttpStatus, Logger, Param, ParseFilePipe, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserDto } from 'src/dto/userDto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from 'src/dto/loginDto';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import * as uniqid from 'uniqid';
import { FileSystemService } from 'src/posts/file-system/file-system.service';
import { CloudinaryUploadFilesService } from 'src/cloudinary/cloudinary-upload-files.service';

@Controller('auth')
export class AuthController {

  constructor(
    private readonly authService: AuthService, 
    private fileSystem: FileSystemService,
    private readonly uploadService: CloudinaryUploadFilesService
  ) { }



  @UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }))
  @UseInterceptors(FileInterceptor('photo',{storage: multer.memoryStorage()}))
  @Post('/create')
  async createUser(
    @UploadedFile(new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/*' }), 
      ]
    })) file: Express.Multer.File,
    @Body() userData: UserDto,
    @Res() resp: Response
  ) {
    try {
      if (!file) {
        Logger.debug(userData)
        throw new BadRequestException('File is required');
      }

      // 👇 Subir a Cloudinary
      const uploadResult = await this.uploadService.uploadImage(file);

      // 👇 Guardar la URL en el DTO
      userData.photo = uploadResult.secure_url;

      const createUser = await this.authService.createUser(userData);

      resp.send({ ok: true, message: "User Created successfully!", user: createUser });
    } catch (error) {
      Logger.error(error);
      resp.status(400).send({ ok: false, message: error.message });
    }
  }

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
