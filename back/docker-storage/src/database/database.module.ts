import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ChannelEntity,
  MessageEntity,
  UserEntity,
} from './entities/channel.entity';
import { ChannelService } from '../channel/channel.service';
import { UserService } from '../user/user.service';
import { MessagesService } from '../messages/messages.service';
import { AuthService } from '../auth/auth.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // config DB mysql
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: parseInt(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      entities: ['dist/**/*.entity{.ts,.js}'], // a chaque modif des fichiers entity, mettre a jour la DB
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ChannelEntity, MessageEntity, UserEntity]),
  ],
  controllers: [],
  providers: [
    ChannelService,
    UserService,
    MessagesService,
    AuthService,
    JwtService,
  ],
  exports: [],
})
export class DatabaseModule {}
