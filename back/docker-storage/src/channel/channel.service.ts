import { Injectable, } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { ChannelEntity } from 'src/database/entities/channel.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/database/entities/user.entity';

@Injectable()
export class ChannelService {

    constructor (
        @InjectRepository(ChannelEntity) // injection du repo dans le service. Un repo a deja des fonctionnalités prêtes a l'emplois. Chaque entité a un repo
        private ChannelRepository: Repository<ChannelEntity>, // typé avec le type Repository<CvEntity>, indiquant qu'il s'agit d'un objet qui peut être utilisé pour effectuer des opérations de base de données sur l'entité CvEntity.
        private authService: AuthService
    ) {
    }

    async getAllChannel(user: UserEntity): Promise<ChannelEntity[]>
    {
        return await this.ChannelRepository.find({
            where: {
                users: { id: user.id }
            }
        })
    }

 
}
