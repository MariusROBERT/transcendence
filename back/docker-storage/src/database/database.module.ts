import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ChannelEntity, MessageEntity, UserEntity } from "./entities/channel.entity";
import {  } from "./entities/user.entity";
import { ChannelService } from "src/channel/channel.service";
import { UserService } from "src/user/user.service";
import { MessagesService } from "src/messages/messages.service";
import { AuthService } from "src/auth/auth.service";
import { JwtService } from "@nestjs/jwt";

// pour lancer avec docker :
//  deja : npm install --save @nestjs/config
//  creer un role pour la db (user)
//  creer db

@Module({
    imports: [
        // ConfigModule.forRoot({
        //     isGlobal: true // module vue par tous les modules
        //   }),
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