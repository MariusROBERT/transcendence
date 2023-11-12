import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('game')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ default: 0 })
  player1: number;

  @Column({ default: 0 })
  elo1!: number;
  
  @Column({ default: 0 })
  player2: number;

  @Column({ default: 0 })
  elo2!: number;

  @Column({ default: 0 })
  points1!: number;

  @Column({ default: 0 })
  points2!: number;

  @Column({ default: 0 })
  winner: number;

  @Column()
  date: Date;
}
