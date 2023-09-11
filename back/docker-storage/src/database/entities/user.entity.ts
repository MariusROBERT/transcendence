import { UserStateEnum, UserRoleEnum } from "src/utils/enums/user.enum";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
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
    password!: string; // hashPwd

    @Column({ default: false })
    is2fa_active!: boolean;

    @Column({ default: 'ta gueule' })
    secret2fa?: string;

    @Column({ type: 'enum', enum: UserStateEnum, default: UserStateEnum.ON })
    user_status!: UserStateEnum;

// CHANNEL :

    @ManyToMany(() => ChannelEntity, (channel) => channel.users)
    @JoinTable()
    public channels: ChannelEntity[];

    @ManyToMany(type => ChannelEntity, channel => channel.admins)
    @JoinTable()
    public admin: ChannelEntity[];

    @OneToMany(type => ChannelEntity, channel => channel.owner)
    @JoinTable()
    public own: ChannelEntity[];

    @ManyToMany(type => ChannelEntity, channel => channel.baned)
    @JoinTable()
    public baned: ChannelEntity[];

    @OneToMany(type => MutedEntity, muted => muted.user)
    @JoinTable()
    public muted: MutedEntity[];

// MESSAGE :

    @OneToMany(type => MessageEntity, message => message.sender)
    @JoinTable()
    public messages: MessageEntity[];

// FRIENDS & INVITE & BLOCKED :

    @Column('integer', { array: true, nullable: true })
    friends: number[];

    @Column('integer', { array: true, nullable: true })
    invites: number[];

    @Column('integer', { array: true, nullable: true })
    invited: number[];

    @Column('integer', { array: true, nullable: true })
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
