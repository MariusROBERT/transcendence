import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { UserEntity } from 'src/database/entities/user.entity';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { ChannelModule } from 'src/channel/channel.module';
import { DatabaseModule } from 'src/database/database.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, ChannelEntity]),
    DatabaseModule,
    AuthModule,
    ChannelModule
  ],
  controllers: [UserController],
  providers: [UserService]//, ChannelService]
})
export class UserModule {}
