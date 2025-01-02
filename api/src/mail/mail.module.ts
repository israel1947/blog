import { Module } from '@nestjs/common';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import {MailerModule} from '@nestjs-modules/mailer'
import {ConfigModule,ConfigService} from '@nestjs/config'
import { join } from 'path';
import { MailService } from './mail.service';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[
    MailerModule.forRootAsync({
      imports:[ConfigModule],
      useFactory:async (config:ConfigService)=>({
          transport:{
            host:config.get('HOST_SECURE'),
            port: config.get('PORT_HOST_EMAIL'),
            secure: false,
            auth:{
              user:config.get('USER_EMAIL'),
              pass:config.get('PASSWORD_EMAIL')
            },
          },
        template:{
          dir:join(__dirname, '/templates'),
          adapter: new HandlebarsAdapter(),
          options:{
            strict:true
          },
        },
      }),
      inject:[ConfigService]
    }),
    UsersModule
  ],
  providers: [MailService],
  exports:[MailModule]
})
export class MailModule {}
