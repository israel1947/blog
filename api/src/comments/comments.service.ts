import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { CommentsDto } from 'src/dto/commentsDto';
import { Comments } from 'src/models/comments';

@Injectable()
export class CommentsService {

  @InjectModel(Comments.name) private commentsModel: Model<Comments>;

  async createComment(commentData: CommentsDto): Promise<Comments> {
    const createComment = new this.commentsModel({
      ...commentData,
    })
    return createComment.save();
  }

  async getComments():Promise<Comments[]>{
    return this.commentsModel.find().exec();
  };

  async countCommentsForPost(postId: string): Promise<number> {
    return this.commentsModel.countDocuments({ post_id: new Types.ObjectId(postId) }).exec();
  }

}