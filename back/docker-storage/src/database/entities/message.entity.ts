import { Column, Entity, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { ChannelEntity } from "./channel.entity";
import { TimeStampEntities } from "../../utils/generics/timestamp.entity";

@Entity('message')
export class MessageEntity extends TimeStampEntities {

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    content!: string;

    @ManyToOne(() => UserEntity, (user) => user.messages)
    sender!: UserEntity;

    @ManyToOne(type => ChannelEntity, channel => channel.messages)
    channel!: ChannelEntity;
}
