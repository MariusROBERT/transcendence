import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import * as dotenv from 'dotenv'; // importer dotenv qui permet de recuperer les var d'env m'importe ou // ==> npm i dotenv
import { ConfigService } from '@nestjs/config'; // ==> npm i --save @nestjs/config

dotenv.config()

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)

  const config = new DocumentBuilder()
    .setTitle('Transcendence')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(configService.get('APP_PORT')); // recup les var d'env. ConfigService est importere dans app.module 

}
bootstrap();
