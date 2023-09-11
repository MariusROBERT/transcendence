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
    chan_status!: ChanStateEnum;

// -------- LINKS TO OTHER TABLES --------

// USERS :

    @ManyToMany(() => UserEntity, (user) => user.channels, {eager: true, nullable: false} )  // lorsqu'un Channel est chargée à partir de la DB, la relation owner sera également chargée automatiquement avec les données de l'entité ChannelEntity.
    @JoinColumn({ name: 'users' }) // @JoinColumn() permet de nommer les colonnes de jointure dans la DB pour ManyToOne
    users?: UserEntity[];

    @ManyToMany(() => UserEntity, (user) => user.admin, {eager: true, nullable: false} )
    @JoinColumn({ name: 'admins' }) // @JoinColumn() permet de nommer les colonnes de jointure dans la DB pour ManyToOne
    admins!: UserEntity[];

    @ManyToOne(() => UserEntity, (user) => user.own, {eager: true, nullable: false} ) // indique que chaque canal (ChannelEntity) est associé à un utilisateur (UserEntity) en tant que propriétaire
    @JoinColumn({ name: 'owner_id' }) // @JoinColumn() permet de nommer les colonnes de jointure dans la DB pour ManyToOne
    public owner!: UserEntity;

    @ManyToMany(() => UserEntity, (user) => user.baned, {eager: true} )
    @JoinColumn({ name: 'baned' }) // @JoinColumn() permet de nommer les colonnes de jointure dans la DB pour ManyToOne
    baned?: UserEntity[];

// MUTED :

    @OneToMany(type => MutedEntity, mutedUser => mutedUser.channel)
    mutedUsers: MutedEntity[];
    
// MESSAGES :

    @OneToMany(type => MessageEntity, message => message.channel, {onDelete: 'CASCADE'})
    messages: MessageEntity[];

}
export { MessageEntity, UserEntity };

