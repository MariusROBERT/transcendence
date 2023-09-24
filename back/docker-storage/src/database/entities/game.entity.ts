import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity('game')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => UserEntity, (user) => user.gamesAsPlayer1)
  @JoinColumn({ name: 'player1_id' })
  player1: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.gamesAsPlayer2)
  @JoinColumn({ name: 'player2_id' })
  player2: UserEntity;

  @Column({ default: 0 })
  points1!: number;

  @Column({ default: 0 })
  points2!: number;

  @Column()
  date: Date;
}
