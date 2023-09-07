import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ChannelEntity } from 'src/database/entities/channel.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChannelEntity]),
    AuthModule,
  ],
  controllers: [ChannelController],
  providers: [ChannelService]
})
export class ChannelModule {}
