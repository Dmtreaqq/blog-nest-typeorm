import { Not, Repository } from 'typeorm';
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

  async findByDeviceId(deviceId: string): Promise<UserDeviceSession | null> {
    const session = await this.userSessionsRepository.findOneBy({
      deviceId,
    });

    if (!session) {
      return null;
    }

    return session;
  }

  async deleteSession(id: string) {
    await this.userSessionsRepository.delete({ id });
  }

  async deleteAllSessionsExcept(deviceId: string, userId: string) {
    await this.userSessionsRepository.delete({
      userId,
      deviceId: Not(deviceId),
    });

    // await this.userSessionsRepository
    //   .createQueryBuilder('s')
    //   .delete()
    //   .where('s.userId = :userId', { userId })
    //   .andWhere('s.device_id != :deviceId', { deviceId })
    //   .execute();
  }
}
