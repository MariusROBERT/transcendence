import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/passport-jwt.strategy';
import { UserEntity } from '../database/entities/user.entity';
import { DatabaseModule } from '../database/database.module';
import { FtStrategy } from './strategy/passport-ft.strategy';
import { SessionSerializer } from './utils/session.serializer';
import { FtAuthFilter } from './filters/ftAuth.filter';

@Module({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({
      defaultStrategy: 'jwt',
    }),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    FtStrategy,
    SessionSerializer,
    FtAuthFilter,
  ],
  exports: [AuthService],
})
export class AuthModule {}
