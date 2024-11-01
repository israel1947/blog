import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Comments, CommentsSchema } from 'src/models/comments';

@Module({
  imports:[MongooseModule.forFeature([{name:Comments.name, schema: CommentsSchema}])],
  providers: [CommentsService],
  controllers: [CommentsController],
  exports: [CommentsService, MongooseModule]
})
export class CommentsModule {}
