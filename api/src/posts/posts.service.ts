import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { FilterPostsDto } from 'src/dto/filterPostsDto';
import { PostDto } from 'src/dto/postsDto';
import { Posts } from 'src/models/posts';



@Injectable()
export class PostsService {

  @InjectModel(Posts.name) private postModel: Model<Posts>;

  async createPost(posts: PostDto): Promise<Posts> {
    const post = new this.postModel(posts);
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

       return{
        ok:true,
        page,
        posts
      } 
  };


}