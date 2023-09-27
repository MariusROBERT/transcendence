import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { ChannelEntity } from './channel.entity';
import { TimeStampEntities } from '../../utils/generics/timestamp.entity';

@Entity('message')
export class MessageEntity extends TimeStampEntities {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  content!: string;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  sender!: UserEntity;

  @ManyToOne(() => ChannelEntity, (channel) => channel.messages)
  channel!: ChannelEntity;

  //@Column()
  //channel_id!: number;
}
