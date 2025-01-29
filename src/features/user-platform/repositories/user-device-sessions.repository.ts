import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserDeviceSession } from '../domain/user-device-session.entity';

export class UserDeviceSessionsRepository {
  constructor(
    @InjectRepository(UserDeviceSession)
    private userSessionsRepository: Repository<UserDeviceSession>,
  ) {}

  async save(session: UserDeviceSession) {
    await this.userSessionsRepository.save(session);
  }

  async findByDeviceId(deviceId: string): Promise<UserDeviceSession> {
    return this.userSessionsRepository.findOneBy({
      deviceId,
    });
  }

  async deleteSession(id: string) {
    await this.userSessionsRepository.delete({ id });
  }
}
