import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Posts, PostSchema } from 'src/models/posts';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { FileSystemService } from './file-system/file-system.service';
import { CommentsService } from 'src/comments/comments.service';
import { CommentsModule } from 'src/comments/comments.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Posts.name, schema: PostSchema }]),
    MulterModule.register({ dest: './uploads' }), //file storage location
    CommentsModule
  ],
  controllers: [PostsController],
  providers: [
    PostsService,
    FileSystemService
  ]
})
export class PostsModule { }
