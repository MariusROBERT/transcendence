import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelEntity, MessageEntity, UserEntity } from "./entities/channel.entity";
import { ChannelService } from "src/channel/channel.service";
import { UserService } from "src/user/user.service";
import { MessagesService } from "src/messages/messages.service";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forRoot({ // config DB mysql
            type: 'postgres',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME,
            entities: ["dist/**/*.entity{.ts,.js}"], // a chaque modif des fichiers entity, mettre a jour la DB
            synchronize: true,
        }),
        TypeOrmModule.forFeature([
			ChannelEntity,
			MessageEntity,
			UserEntity,
		]),
    ],
    controllers: [],
    providers: [
        ChannelService,
        UserService,
        MessagesService,
        AuthService,
        JwtService
    ],
    exports: []
})
export class DatabaseModule {};