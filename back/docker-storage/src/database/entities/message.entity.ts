import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { ChannelEntity } from "./channel.entity";

@Entity('message')
export class MessageEntity {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    date!: Date;

    @Column()
    content!: string;

    @ManyToOne(() => UserEntity, (user) => user.messages)
    sender!: UserEntity;

    @ManyToOne(type => ChannelEntity, channel => channel.messages)
    channel!: ChannelEntity;
}
