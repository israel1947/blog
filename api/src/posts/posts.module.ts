import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Posts, PostSchema } from 'src/models/posts';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { FileSystemService } from './file-system/file-system.service';

@Module({
  imports:[
    MongooseModule.forFeature([{name:Posts.name, schema: PostSchema}]),
    MulterModule.register({ dest: './uploads' }), //file storage location
  ],
  controllers: [PostsController],
  providers: [PostsService, FileSystemService]
})
export class PostsModule {}
