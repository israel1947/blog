import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';


@Module({
  imports: [
    UsersModule,
    ConfigModule.forRoot({ isGlobal: true, }),
    MongooseModule.forRoot(process.env.db, { dbName: process.env.DB_NAME }),
    AuthModule,
    PostsModule,
    CommentsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
