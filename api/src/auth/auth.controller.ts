import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Response, Request } from 'express';
import { UserDto } from 'src/dto/userDto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';
import { LoginDto } from 'src/dto/loginDto';

@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) { }
  
  @UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }))
  @Post('/create')
  async createUser(@Body() userData: UserDto, @Res() resp: Response) {

    try {
      const createUser = await this.authService.createUser(userData);
      resp.send({ ok: true, message: "User Created sussefully!", user: createUser });
    } catch (error) {
      console.error(error);
      resp.status(400).send({ ok: false, message: error.message });
    };
  };

  @HttpCode(HttpStatus.OK)
  @Post('/login')
  async singIn(@Body() singInDto:LoginDto, @Res() resp: Response){
    try {
      const singInUser = await this.authService.login(singInDto.email, singInDto.password);
      resp.send({ok:true, message:"Correct login!", user: singInUser})
    } catch (error) {
      console.error(error);
      resp.status(400).send({ ok: false, message: error.message });
    }
  }

  @UseGuards(AuthGuard)
  @Get('/profile')
  getProfile(@Req() req: Request) {
    return req.user;
  }
}
