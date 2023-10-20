// msgsUnread.module.ts

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MsgsUnreadEntity } from 'src/database/entities/msgsunread.entity';
import { MsgsUnreadService } from './msgsunread.service';
import { MsgsUnreadController } from './msgsunread.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MsgsUnreadEntity])],
  controllers: [MsgsUnreadController],
  providers: [MsgsUnreadService],
})
export class MsgsUnreadModule {}
