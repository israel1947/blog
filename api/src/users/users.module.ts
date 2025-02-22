import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from 'src/models/user';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MailService } from 'src/mail/mail.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      global: true,
      secret: process.env.SECRET,
      signOptions: { expiresIn: '90s' }
    })
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    JwtService,
    MailService
  ],
  exports: [UsersService],
})
export class UsersModule { }
