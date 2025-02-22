import { Body, Controller, Get, Post, Res, UseGuards, UseInterceptors, Param, ParseFilePipe, FileTypeValidator, UploadedFiles, Req, Query, Delete } from '@nestjs/common';
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
import { MailService } from 'src/mail/mail.service';

@Controller('posts')
export class PostsController {

  constructor(private readonly postsService: PostsService, private fileSystem: FileSystemService,private email:MailService) { };



  @UseGuards(AuthGuard)
  @Post('/create')
  @UseInterceptors(FilesInterceptor('images', 3, {
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

      postData.images = files.map((e) => { return e.filename });
      const createPost = await this.postsService.createPost(postData);
      if (createPost) {
        this.email.testEamil(true, createPost)
      }
      resp.send({ ok: true, message: "Post Created sussefully!", post: createPost });

    } catch (error) {
      resp.status(400).send({ ok: false, message: error.message });
    }
  }

  @Get('search')
  async getpostsByCategory(@Query('category') category: string, @Res() resp: Response) {

    if (!category) {
      return resp.status(400).json({ ok: false, message: 'Category is required' });
    }

    try {
      const postsData = await this.postsService.getPostByCategory(category);
      return resp.status(200).json(postsData);
    } catch (error) {
      return resp.status(204).json({ ok: false, message: error.message });
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
  async getPostById(@Param('friendlyId') friendlyId: string, @Res() resp: Response) {
    try {
      const data = await this.postsService.getPostById(friendlyId);
      return resp.json(data);
    } catch (error) {
      return resp.status(500).json({ ok: false, message: error });
    }
  };

  @Get()
  async getPosts(@Query() params: FilterPostsDto, @Res() res: Response) {
    try {
      const result = await this.postsService.getAllPosts(params);
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ ok: false, message: 'Error fetching posts' });
    }
  }

  @UseGuards(AuthGuard)
  @Delete('delete/:id')
  async deletePosts(@Param('id') id: string, @Res() resp: Response){
    try {
      const postToDelete = await this.postsService.removePosts(id);
      resp.send({ ok: true, messge: `Posts deleted Susscefully!`});
      return postToDelete;
    } catch (error) {
      return resp.status(500).json({ ok: false, message: `Posts with id ${error.value} not found or does not exist` });
    }
  }
}