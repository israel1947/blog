import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  ConfigModule.forRoot({
    envFilePath: '../.env',
    isGlobal: true
  })
  const app = await NestFactory.create(AppModule, { cors: true });
  const config = new DocumentBuilder()
    .setTitle('Blog')
    .setDescription('The blog API description')
    .setVersion('1.0')
    .addTag('blog')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);


  const port = (process.env.PORT || 4000);
  await app.listen(port, '0.0.0.0', () => {
    Logger.debug(`App it is listening on http://localhost:${port}`);
  });

  Logger.debug(`App it is listening "${port}" port`);



}
bootstrap();
