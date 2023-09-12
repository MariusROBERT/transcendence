import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv'; // importer dotenv qui permet de recuperer les var d'env m'importe ou // ==> npm i dotenv
import { ConfigService } from '@nestjs/config'; // ==> npm i --save @nestjs/config
import { ValidationPipe } from '@nestjs/common';

dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const configService = app.get(ConfigService);

  console.log('Start');
  const config = new DocumentBuilder().setTitle('Transcendence').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // chaque fois qu'on trouve un element, nest (validationPipe) le transforme en le type quon a precisé (ex : mesQueryParams: GetPaginatedTodosDto)
      whitelist: true, // accepte seulement ce qu'on a demandé au client (evite les injections sql par exemple)
      forbidNonWhitelisted: true, // si il essaye d'envoyer des trucs que j'ai pas demandé, une erreur sera envoyée
    }),
  );
  await app.listen(parseInt(process.env.BACK_PORT));
}
bootstrap();
