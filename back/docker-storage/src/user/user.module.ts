import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity]),
    AuthModule
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
