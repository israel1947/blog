import { Body, Controller, Delete, FileTypeValidator, Get, Param, ParseFilePipe, Patch, Query, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response } from 'express';
import { UsersService } from './users.service';
import { UserDto } from 'src/dto/userDto';
import { AuthGuard } from 'src/auth/auth.guard';
import { MailService } from 'src/mail/mail.service';
import { FileInterceptor } from '@nestjs/platform-express';
import * as multer from 'multer';
import * as path from 'path';
import * as uniqid from 'uniqid';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService, private email: MailService) { }


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
  @UseInterceptors(FileInterceptor('photo', {
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '../../uploads/user/profile');
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const nameArr = file.originalname.split('.')
        const extention = nameArr[nameArr.length - 1];
        const uniqId = uniqid();
        const uniqueName = `${uniqId}.${extention}`
        cb(null, uniqueName);
      },
    }),
  }))
  @Patch(':id')
  async updateUser(
    @Param('id') id: string,
    @UploadedFile(new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/jpeg' })
      ]
    })) file: Express.Multer.File,
    @Res() resp: Response,
    @Body() userData: UserDto,
  ) {
    try {
      userData.photo = file.filename;
      const updatedUser = await this.userService.updateUser(id, userData);
      resp.send({ ok: true, messge: "User Updated Susscefully!", user: updatedUser });
    } catch (error) {
      resp.status(400).send({ ok: false, message: error.message });
    };
  };


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
