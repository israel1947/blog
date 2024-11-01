import { Body, Controller, Get, Post, Res, UseGuards, UseInterceptors, Param, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator, UploadedFiles, Req, Query } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostDto } from 'src/dto/postsDto';
import { PostsService } from './posts.service';
import { Response } from 'express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { FileSystemService } from './file-system/file-system.service';
import * as multer from 'multer';
import * as path from 'path';
import * as uniqid from 'uniqid';
import { FilterPostsDto } from 'src/dto/filterPostsDto';
import { Posts } from 'src/models/posts';

@Controller('posts')
export class PostsController {

  constructor(private postsService: PostsService, private fileSystem: FileSystemService) { };



  @UseGuards(AuthGuard)
  @Post('/create')
  @UseInterceptors(FilesInterceptor('images',3,{
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        const uploadPath = path.resolve(__dirname, '../../uploads');
        cb(null, uploadPath);
      },
      filename: (req, file, cb) => {
        const nameArr = file.originalname.split('.')
        const extention = nameArr[nameArr.length - 1];
        const uniqId = uniqid();
        const uniqueName = `${uniqId}.${extention}`
        cb(null, uniqueName);
      },
    }),
  }))
  async createPosts(@UploadedFiles(
    new ParseFilePipe({
      validators: [
        new FileTypeValidator({ fileType: 'image/jpeg' })
      ]
    })
  ) files: Array<Express.Multer.File>, @Body() postData: PostDto, @Res() resp: Response) {
    try {
      
      postData.images = files.map((e)=> {return e.filename});
      const createPost = await this.postsService.createPost(postData)
      resp.send({ ok: true, message: "Post Created sussefully!", post: createPost });

    } catch (error) {
      resp.status(400).send({ ok: false, message: error.message });
    }
  }

  @Get()
  async getPosts(@Query() params: FilterPostsDto, @Res() res: Response){
    try {
      const result = await this.postsService.getAllPosts(params);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ ok: false, message: 'Error fetching posts' });
    }
  }




   @Get('image/:img')
  async getImgById(@Res() resp: Response, @Param('img') img: string) {
    try {
      const pathImage = await this.fileSystem.getImgByUrl(img);
      if (!pathImage) {
        return resp.status(404).send({ ok: false, message: "Image not found" });
      }
      resp.sendFile(pathImage);

    } catch (error) {
      resp.status(500).send({ ok: false, message: "Internal Server Error" });
    }
  } 

  @Get(':friendlyId')
  async getPostById(@Param('friendlyId') friendlyId: string): Promise<Posts>{
    return this.postsService.getPostById(friendlyId);
  };
}