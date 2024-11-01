import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { CommentsDto } from 'src/dto/commentsDto';
import { CommentsService } from './comments.service';
import { Response, Request } from 'express';
import { AuthGuard } from 'src/auth/auth.guard';

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
}
