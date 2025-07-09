import { BadRequestException, Body, Controller, Delete, FileTypeValidator, Get, Logger, Param, ParseFilePipe, Patch, Query, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UserDto } from 'src/dto/userDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { MailService } from 'src/mail/mail.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import * as uniqid from 'uniqid';
import { CloudinaryUploadFilesService } from 'src/cloudinary/cloudinary-upload-files.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private email: MailService,
    private readonly uploadService: CloudinaryUploadFilesService

  ) { }


  @Get()
  getAllUsers() {
    return this.userService.findAllUsers();
  };

  @Get('user')
  async getUserByEmail(@Query('email') email: string, @Res() resp: Response) {
    try {
      const user = await this.userService.findOne(email);
      resp.send({ ok: true, user: user });
    } catch (error) {
      resp.status(404).send({ ok: false, message: error.message });
    };
  };

  @Get('suscription')
  async suscrito(@Query('suscription') suscription: string, @Res() resp: Response) {

    try {
      const isSubscribed = suscription === 'true';
      console.log(isSubscribed);

      /*  const user = await this.userService.userSubscribed(isSubscribed); */
      const user = await this.email.testEamil(isSubscribed);
      resp.send({ ok: true, user: user });
    } catch (error) {
      resp.status(404).send({ ok: false, message: error.message });
    }
  }


  @UseGuards(AuthGuard)
  @UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }))
  @UseInterceptors(FileInterceptor('photo')) // 🔄 sin configuración de disco
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/jpeg' }), // puedes agregar más si quieres
      ],
    })) file: Express.Multer.File,
    @Res() resp: Response,
    @Body() userData: UserDto,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('Photo is required');
      }

      // 👇 Subir imagen a Cloudinary
      const uploadedImage = await this.uploadService.uploadImage(file);

      // 👇 Guardar la URL en lugar del filename
      userData.photo = uploadedImage.secure_url;

      const updatedUser = await this.userService.updateUser(id, userData);

      resp.send({ ok: true, message: "User Updated Successfully!", user: updatedUser });
    } catch (error) {
      Logger.error(error);
      resp.status(400).send({ ok: false, message: error.message });
    }
  }


  @Delete(':id')
  deleteUser(@Param('id') id: string, @Res() resp: Response) {
    resp.send({ ok: true, messge: "User deleted Susscefully!" });
    return this.userService.removeUser(id);
  };

  @Get(':id')
  async getUserById(@Param('id') id: string, @Res() resp: Response) {
    try {
      const user = await this.userService.findUserById(id);
      resp.send({ ok: true, user: user });
    } catch (error) {
      resp.status(404).send({ ok: false, message: error.message });
    };
  };
}
