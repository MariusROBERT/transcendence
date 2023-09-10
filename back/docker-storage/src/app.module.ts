import { Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm'; // ==> npm install --save @nestjs/typeorm typeorm mysql2
import { AuthModule } from './auth/auth.module';
import { ChannelController } from './channel/channel.controller';
import { MessagesService } from './messages/messages.service';
import { MessagesModule } from './messages/messages.module';
import { MutedController } from './muted/muted.controller';
import { UserController } from './user/user.controller';
import { ChannelService } from './channel/channel.service';
import { UserService } from './user/user.service';
import { MutedService } from './muted/muted.service';
import { MessagesController } from './messages/messages.controller';
import { ChannelModule } from './channel/channel.module';
import { UserModule } from './user/user.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true // module vue par tous les modules
    }),
    TypeOrmModule.forRoot({ // config DB postgres
    type: 'postgres',
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    entities: ["dist/**/*.entity{.ts,.js}"], // a chaque modif des fichiers entity, mettre a jour la DB
    synchronize: true,
  }),
    AuthModule,
    UserModule,
    MessagesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
  exports: [AppService]
})
export class AppModule {}
