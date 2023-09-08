import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from 'src/database/entities/user.entity';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { MessageEntity } from 'src/database/entities/message.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { ChannelService } from 'src/channel/channel.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ChannelEntity, MessageEntity]),
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService, ChannelService]
})
export class UserModule {}
