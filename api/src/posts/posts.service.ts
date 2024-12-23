import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Promise } from 'mongoose';
import { FilterPostsDto } from 'src/dto/filterPostsDto';
import { PostDto } from 'src/dto/postsDto';
import { Posts } from 'src/models/posts';
import { CommentsService } from '../comments/comments.service';
import slugify from 'slugify';



@Injectable()
export class PostsService {

  @InjectModel(Posts.name) private postModel: Model<Posts>;

  constructor(private readonly commentService: CommentsService) { }


  processTags(tags: string[]): string[] {
    return tags
      .filter((tag) => tag && !tag.includes(',')) // Elimina cadenas concatenadas
      .map((tag) => tag.trim())
      .filter((tag, index, self) => self.indexOf(tag) === index); // Elimina duplicados
  }


  async createPost(posts: PostDto): Promise<Posts> {
    const cleanTags = this.processTags(posts.tags);
    const post = new this.postModel({
      ...posts,
      tags:cleanTags,
      friendlyId: slugify(posts.title, { lower: true }),
    });
    return post.save();
  }

  async getAllPosts(params?: FilterPostsDto): Promise<{ ok: boolean, page: number, posts: Posts[]  }> {
    const page = params?.page ? Number(params.page) : 1; // Page 1 for default
    const skip = (page - 1) * 10;

    const posts = await this.postModel
      .find()
      .sort({ _id: -1 })
      .skip(skip)
      .limit(10)
      /*  .populate('user', '-password')  */
      .exec();

      if (!posts || posts.length === 0) {
        return {
          ok: false,
          page,
          posts: [],
        };
      }

    const idComment = posts.map((post) => post._id.toString());
    const commentData = await this.commentService.countCommentsForPost(idComment)
    
    const postWithComment  = posts.map((post, i)=>{
      return {
        ...post.toObject(),
        comment:commentData[i]
      }
    })

    return {
      ok: true,
      page,
      posts: postWithComment,
    };
  };


  async getPostById(friendlyId: string): Promise<{ ok: boolean, post: Posts }> {
    const post = await this.postModel.findOne({ friendlyId }).exec();
    if (!post) {
      throw new Error(`No se encontró un post con el friendlyId ${friendlyId}`);
    }
    const data = await this.commentService.getCommentsForId(post._id.toString());
    const postWithComment = {
      ...(post.toObject() as Posts),
      comment: data.length
    };
    return {
      ok: true,
      post: postWithComment,
    };
  };

 async getPostByCategory(category: string ): Promise<{ ok: boolean, posts: Posts[] }>  {
    const postsByCategory = await this.postModel.find({ category }).exec();
    if (!postsByCategory || postsByCategory.length === 0) {
      throw new NotFoundException(`No posts were found with category ${category}`);
    }

    return {
      ok:true,
      posts: postsByCategory
    }
  } 
}