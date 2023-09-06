import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { UserEntity } from "./user.entity";
import { ChanStateEnum } from "src/utils/enums/channel.enum";
import { MessageEntity } from "./message.entity";
import { MutedEntity } from "./muted.entity";

@Entity('channel')
export class ChannelEntity {

// BASICS :

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    channel_name!: string;

    @Column({ nullable: true })
	password?: string;

    @Column({ type: 'enum', enum: ChanStateEnum, default: ChanStateEnum.PUBLIC })
    chan_status!: string;

// -------- LINKS TO OTHER TABLES --------

// USERS :

    @ManyToMany(() => UserEntity, (user) => user.channels, {onDelete: 'CASCADE'} )
    users?: UserEntity[];

    @ManyToMany(() => UserEntity, (user) => user.admin_chan, {onDelete: 'CASCADE'} )
    admin!: UserEntity[];

    @ManyToOne(() => UserEntity, (user) => user.own_chan, {onDelete: 'CASCADE'} )
    @JoinColumn({ name: 'owner_id' }) // @JoinColumn() permet de nommer les colonnes de jointure dans la DB pour ManyToOne
    owner!: UserEntity;

    @ManyToMany(() => UserEntity, (user) => user.ban_chan, {onDelete: 'CASCADE'} )
    banned?: UserEntity[];

// MUTED :

    @OneToMany(type => MutedEntity, mutedUser => mutedUser.channel)
    mutedUsers: MutedEntity[];
    
// MESSAGES :

    // @OneToMany(type => MessageEntity, message => message.channel)
    messages: MessageEntity[];

    // msg_unread: msgUnread[] ??

}
