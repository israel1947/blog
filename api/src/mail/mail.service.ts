import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, Logger } from '@nestjs/common';
import { PostDto } from 'src/dto/postsDto';
import { UsersService } from 'src/users/users.service';
import * as Handlebars from 'handlebars';
import { Posts } from 'src/models/posts';

@Injectable()
export class MailService {
  private readonly logger = new Logger('MailService');
  constructor(
    private mailerService: MailerService,
    private user: UsersService
  ) { };

  async testEamil(suscription:boolean,postData?:Posts) {

    //reducir contenido de la descripcion a solo 200 caracteres
    Handlebars.registerHelper('truncate', (str: string, len: number) => {
      if (str.length > len) {
        return str.substring(0, len) + '...';
      }
      return str;
    });


    const subscribed = this.user.userSubscribed(suscription)
    const subscribedString = (await subscribed).map((resp) => {
      return resp.email
    })
    const template = 'test.hbs';
    const postCreationDate =  postData.created_at.toISOString().substring(0,10) //date  2025-01-02

    await this.mailerService.sendMail({
      to: subscribedString,
      from: 'israeldavidsdvsf@gmail.com',
      subject: `¡New Post: ${postData.title}`,
      text: 'Welcome',
      template: template,
      context: {
        title: postData.title,
        image: postData.images[0],
        desciption:postData.description,
        category: postData.category,
        creationDate:postCreationDate,
        readingTime:postData.last_read_at,
        url:postData.friendlyId
      },
    });
    this.logger.log('Email Send');
  }
}