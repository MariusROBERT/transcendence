import { UserStateEnum, UserRoleEnum } from "src/utils/enums/user.enum";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ChannelEntity } from "./channel.entity";
import { GameEntity } from "./game.entity";
import { MessageEntity } from "./message.entity";
import { MutedEntity } from "./muted.entity";

// BON A SAVOIR : Pour éviter de charger toutes les relations à chaque requête de récupération d'utilisateur, TypeORM utilise le chargement paresseux (lazy loading) par défaut.

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

    @Column({ default: false })
    is2fa_active!: boolean;

    @Column({ default: 'ta gueule' })
    secret2fa?: string;

    @Column({ type: 'enum', enum: UserStateEnum, default: UserStateEnum.ON })
    user_status!: UserStateEnum;

// CHANNEL :

    @ManyToMany(() => ChannelEntity, (channel) => channel.users, {onDelete: 'CASCADE'})
    @JoinTable()
    channels: ChannelEntity[];

    @ManyToMany(type => ChannelEntity, channel => channel.admin)
    @JoinTable()
    admin_chan: ChannelEntity[];

    @OneToMany(type => ChannelEntity, channel => channel.owner)
    @JoinTable()
    own_chan: ChannelEntity[];

    @ManyToMany(type => ChannelEntity, channel => channel.banned)
    @JoinTable()
    ban_chan: ChannelEntity[];

    @OneToMany(type => MutedEntity, mutedUser => mutedUser.user)
    @JoinTable()
    mutedChannels: MutedEntity[];

// MESSAGE :

    @OneToMany(type => MessageEntity, message => message.sender)
    @JoinTable()
    messages: MessageEntity[];

// FRIENDS & INVITE & BLOCKED :

    @ManyToMany(() => UserEntity, (user) => user.friends, {onDelete: 'CASCADE'} )
    // friends: UserEntity[];
    @JoinColumn({ name: 'friend_id'})
    friends: number[];

    @ManyToMany(() => UserEntity, (user) => user.invites, {onDelete: 'CASCADE'} )
    @JoinColumn({ name: 'invites_id'})
    // invites: UserEntity[];
    invites: number[];

    @ManyToMany(() => UserEntity, (user) => user.invited, {onDelete: 'CASCADE'} )
    @JoinColumn({ name: 'invited_id'})
    // invited: UserEntity[];
    invited: number[];

    @ManyToMany(() => UserEntity, (user) => user.blocked, {onDelete: 'CASCADE'} )
    @JoinColumn({ name: 'blocked_id'})
    // blocked: UserEntity[];
    blocked: number[];


// GAME :

    @Column({ default: 0 })
    winrate: number;

    // last_message_recv: Date ??

    @OneToMany(() => GameEntity, (game) => game.player1)
	gamesAsPlayer1: GameEntity[];

	@OneToMany(() => GameEntity, (game) => game.player2)
	gamesAsPlayer2: GameEntity[];
}
