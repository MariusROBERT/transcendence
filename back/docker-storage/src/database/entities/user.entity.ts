import { UserStateEnum, UserRoleEnum } from "src/utils/enums/user.enum";
import { Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChannelEntity } from "./channel.entity";
import { GameEntity } from "./game.entity";
import { MessageEntity } from "./message.entity";
import { MutedEntity } from "./muted.entity";

@Entity('user')
export class UserEntity {

// PERSO :

    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true, nullable: false })
    username!: string;

    // @Column({ unique: true })
    // email: string; // pour le 2fa ??

    @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
    role!: UserRoleEnum;

    @Column({ default: 'url_img_profil_default' })
    urlImg!: string;

    @Column()
    salt: string;

    @Column({ unique: true })
    password: string; // hashPwd

    @Column()
    is2fa_active!: boolean;

    @Column()
    secret2fa?: string;

    @Column({ type: 'enum', enum: UserStateEnum, default: UserStateEnum.ON })
    user_status!: string;

// CHANNEL :

    @ManyToMany(() => ChannelEntity, (channel) => channel.users, {onDelete: 'CASCADE'})
    channels: ChannelEntity[];

    @ManyToMany(type => ChannelEntity, channel => channel.admin)
    admin_chan: ChannelEntity[];

    @OneToMany(type => ChannelEntity, channel => channel.owner)
    own_chan: ChannelEntity[];

    @ManyToMany(type => ChannelEntity, channel => channel.banned)
    ban_chan: ChannelEntity[];

    @OneToMany(type => MutedEntity, mutedUser => mutedUser.user)
    mutedChannels: MutedEntity[];

// MESSAGE :

    @OneToMany(type => MessageEntity, message => message.sender)
    messages: MessageEntity[];

// FRIENDS & INVITE & BLOCKED :

    @ManyToMany(() => UserEntity, (user) => user.friends, {onDelete: 'CASCADE'} )
    friends: UserEntity[];

    @ManyToMany(() => UserEntity, (user) => user.invites, {onDelete: 'CASCADE'} )
    invites: UserEntity[];

    @ManyToMany(() => UserEntity, (user) => user.invited, {onDelete: 'CASCADE'} )
    invited: UserEntity[];

    @ManyToMany(() => UserEntity, (user) => user.blocked, {onDelete: 'CASCADE'} )
    blocked: UserEntity[];


// GAME :

    @Column()
    winrate: number;

    // last_message_recv: Date ??

    @OneToMany(() => GameEntity, (game) => game.player1)
	gamesAsPlayer1: GameEntity[];

	@OneToMany(() => GameEntity, (game) => game.player2)
	gamesAsPlayer2: GameEntity[];
}
