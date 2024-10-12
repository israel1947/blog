import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User, UserSchema } from 'src/models/user';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';

@Module({
  imports:[MongooseModule.forFeature([{name:User.name, schema: UserSchema}])],
  controllers:[UsersController],
  providers: [UsersService]
})
export class UsersModule {}
