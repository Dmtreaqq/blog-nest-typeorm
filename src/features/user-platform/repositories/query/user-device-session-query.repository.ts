import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async getAllSessions(
    userId: string,
    deviceId: string,
    iat: number,
  ): Promise<UserDeviceSessionsViewDto[]> {
    const session = await this.sessionsRepository.findOneBy({ deviceId });
    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.issuedAt !== iat) {
      throw new UnauthorizedException();
    }

    const sessions = await this.sessionsRepository
      .createQueryBuilder('s')
      .where('s.userId = :userId', { userId })
      .orderBy('s.created_at', 'ASC')
      .getMany();

    return sessions.map(UserDeviceSessionsViewDto.mapToView);
  }
}
