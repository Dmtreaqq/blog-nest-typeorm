import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserDeviceSession } from '../../domain/user-device-session.entity';
import { UserDeviceSessionsViewDto } from '../../api/view-dto/user-device-sessions.view-dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserDeviceSessionQueryRepository {
  constructor(
    @InjectRepository(UserDeviceSession)
    private sessionsRepository: Repository<UserDeviceSession>,
  ) {}

  async getAllSessions(userId: string): Promise<UserDeviceSessionsViewDto[]> {
    const sessions = await this.sessionsRepository
      .createQueryBuilder('s')
      .where('s.userId = :userId', { userId })
      .getMany();

    return sessions.map(UserDeviceSessionsViewDto.mapToView);
  }
}
