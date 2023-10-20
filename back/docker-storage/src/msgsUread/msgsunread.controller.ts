// msgsUnread.controller.ts

import { Controller, Get, Param, Delete, Post, Body, ParseIntPipe, NotFoundException } from '@nestjs/common';
import { MsgsUnreadService } from './msgsunread.service';
import { MsgsUnreadEntity } from 'src/database/entities/msgsunread.entity';
import { MsgsUnreadDto } from 'src/chat/chat.gateway';

@Controller('msgsUnread')
export class MsgsUnreadController {
	constructor(private readonly msgsUnreadService: MsgsUnreadService) { }

	@Get()
	async findAll() {
		return this.msgsUnreadService.findAll();
	}

	@Post()
	async create(@Body() msgsUnread: MsgsUnreadDto) {
		this.msgsUnreadService.create(msgsUnread);
	}

	@Get('/user/:id')
  async findMsgsUnreadForUser(@Param('id', ParseIntPipe) id: number): Promise<MsgsUnreadEntity[]> {
    return this.msgsUnreadService.findMsgsUnreadForUser(id);
  }

	@Delete(':id')
	async remove(@Param('id', ParseIntPipe) id: number) {
		return this.msgsUnreadService.remove(id);
	}

	@Delete('remove/:senderId')
  async removeMsgsUnreadBySender(@Param('senderId') senderId: number): Promise<void> {
    try {
      await this.msgsUnreadService.removeMsgsUnreadBySender(senderId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        // Gérer le cas où aucun message non lu n'a été trouvé pour le senderId spécifié
        throw new NotFoundException('No unread messages found for the specified sender');
      } else {
        // Gérer d'autres erreurs potentielles
        throw error;
      }
    }
  }
}
