// msgsUnread.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundError } from 'rxjs';
import { MsgsUnreadDto } from 'src/chat/chat.gateway';
import { MsgsUnreadEntity } from 'src/database/entities/msgsunread.entity';
import { Repository } from 'typeorm';

@Injectable()
export class MsgsUnreadService {
	constructor(
		@InjectRepository(MsgsUnreadEntity)
		private readonly msgsUnreadRepository: Repository<MsgsUnreadEntity>,
	) { }

	async findAll(): Promise<MsgsUnreadEntity[]> {
		return this.msgsUnreadRepository.find();
	}

	async findOne(id: number): Promise<MsgsUnreadEntity> {
		return this.msgsUnreadRepository.findOne({ where: { id } });
	}

	async findMsgsUnreadForUser(userId: number): Promise<MsgsUnreadEntity[]> {
		try {
			return this.msgsUnreadRepository.find({
				where: { receiver_id: userId },
			});
		} catch (e) {
			throw new NotFoundException(`aucun msg unread`);
		}
	}

	async removeMsgsUnreadByChan(channel_id: number): Promise<void> {
		try {
			const msgsUnread = await this.msgsUnreadRepository.find({ where: { channel_id: channel_id } });
			await this.msgsUnreadRepository.remove(msgsUnread);
		} catch (e) {
			throw new NotFoundException('No unread messages found for the specified sender');
		}
	}

	async removeMsgsUnreadBySender(sender_id: number): Promise<void> {
		try {
			const msgsUnread = await this.msgsUnreadRepository.find({ where: { sender_id: sender_id } });
			await this.msgsUnreadRepository.remove(msgsUnread);
		} catch (e) {
			throw new NotFoundException('No unread messages found for the specified sender');
		}
	}

	async create(msgsUnread: MsgsUnreadDto) {
		const newMsgsUnread = this.msgsUnreadRepository.create(msgsUnread);
		await this.msgsUnreadRepository.save(newMsgsUnread);
	}

	async remove(id: number): Promise<void> {
		await this.msgsUnreadRepository.delete(id);
	}
}
