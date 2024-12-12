import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User, UserSchema } from 'src/models/user';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from '../users/users.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';
import { FileSystemService } from 'src/posts/file-system/file-system.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name:User.name, schema: UserSchema}]),
    MulterModule.register({ dest: './uploads/user/profile' }), //file storage location
    JwtModule.register({
      global:true,
      secret:process.env.SECRET,
      signOptions:{expiresIn:'90s'}
    })
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    UsersService, 
    JwtService,
    FileSystemService
  ]
})
export class AuthModule {}
