import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterPostsDto } from 'src/dto/filterPostsDto';
import { PostDto } from 'src/dto/postsDto';
import { Posts } from 'src/models/posts';
import { CommentsService } from '../comments/comments.service';
import slugify from 'slugify';



@Injectable()
export class PostsService {

  @InjectModel(Posts.name) private postModel: Model<Posts>;

  constructor(private readonly commentService: CommentsService) { }

  async createPost(posts: PostDto): Promise<Posts> {
    const post = new this.postModel({
      ...posts,
      friendlyId: slugify(posts.title, { lower: true }),
    });
    return post.save();
  }

  async getAllPosts(params?: FilterPostsDto): Promise<{ ok: boolean, page: number, posts: Posts[] }> {
    const page = params?.page ? Number(params.page) : 1; // Page 1 for default
    const skip = (page - 1) * 10;

    const posts = await this.postModel
      .find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10)
      /*  .populate('user', '-password')  */
      .exec();

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await this.commentService.countCommentsForPost(post._id.toString());
        return { ...post.toObject(), comments };
      })
    );

    return {
      ok: true,
      page,
      posts: postsWithComments,
    };
  };


  async getPostById(friendlyId : string): Promise<Posts> {
    const post = await this.postModel.findOne({friendlyId}).exec();
    if(!post) {
      throw new Error('Post not found');
    };
    return post;
  };


}