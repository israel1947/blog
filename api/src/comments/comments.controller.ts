import { Body, Controller, Get, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { CommentsDto } from 'src/dto/commentsDto';
import { CommentsService } from './comments.service';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';
import { PostsService } from 'src/posts/posts.service';

@Controller('comments')
export class CommentsController {

  constructor(private readonly comentService:CommentsService){};

  @UseGuards(AuthGuard)
  @Post('/create')
  async createComment(@Body() comentDta: CommentsDto, @Res() resp: Response) {
    try {
      const createComment = await  this.comentService.createComment(comentDta);
      resp.send({ok:true, message:'Comment Created Succefully!', comment:createComment})
    } catch (error) {
      resp.status(400).send({ ok: false, message: error.message });
    }
  };


  @Get()
  async allComments(){
    return this.comentService.getComments();
  }

  @Get('comment')
  async commentsById( @Query('post_id') post_id:string, @Res() resp:Response){
    try {
      const commentsData = await this.comentService.getCommentsForId(post_id);
      resp.send({ok:true, message:'Comments', comments:commentsData});
    } catch (error) {
      resp.status(400).send({ok:false, message: error.message});
    }
  }
}
