import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { MutedEntity } from 'src/database/entities/muted.entity';
import { MutedService } from './muted.service';
import { MutedController } from './muted.controller';

@Module({
  imports: [TypeOrmModule.forFeature([MutedModule]), AuthModule, MutedEntity],
  controllers: [MutedController],
  providers: [MutedService],
})
export class MutedModule {}
