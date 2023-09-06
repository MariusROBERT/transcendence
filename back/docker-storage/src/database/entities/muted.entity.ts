import { CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, Unique } from "typeorm";
import { UserEntity } from "./user.entity";
import { ChannelEntity } from "./channel.entity";

@Entity('muted')
@Unique(['user', 'channel'])
export class MutedEntity {

    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => UserEntity)
    user: UserEntity;
  
    @ManyToOne(type => ChannelEntity)
    channel: ChannelEntity;
  
    @CreateDateColumn()
    endDate: Date;
}
