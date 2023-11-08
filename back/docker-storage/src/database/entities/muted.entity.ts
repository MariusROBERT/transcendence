import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ChannelEntity } from './channel.entity';

@Entity('muted')
@Unique(['user', 'channel'])
export class MutedEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @ManyToOne(() => ChannelEntity, (channel) => channel.mutedUsers)
  channel: ChannelEntity;

  @CreateDateColumn()
  endDate: Date;
}
