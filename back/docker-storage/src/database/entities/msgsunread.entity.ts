import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  @Entity('msgsunread')
  export class MsgsUnreadEntity {
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    sender_id: number;

    @Column()
    receiver_id: number
  
    @Column()
    channel_id: number;

    @Column({default: false})
    priv_msg: boolean

    @Column({ nullable: true })
    channel_name: string;

    @Column({ nullable: true })
    sender_username: string;
  }
  