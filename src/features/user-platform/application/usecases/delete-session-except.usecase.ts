import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import {
  ForbiddenException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDeviceSessionsRepository } from '../../repositories/user-device-sessions.repository';

export class DeleteSessionExceptCommand {
  constructor(
    public deviceId: string,
    public userId: string,
    public iat: number,
  ) {}
}

@CommandHandler(DeleteSessionExceptCommand)
export class DeleteSessionExceptUseCase
  implements ICommandHandler<DeleteSessionExceptCommand, void>
{
  constructor(private sessionsRepository: UserDeviceSessionsRepository) {}

  async execute(command: DeleteSessionExceptCommand): Promise<void> {
    const { deviceId, userId, iat } = command;
    const session = await this.sessionsRepository.findByDeviceId(deviceId);

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.issuedAt !== iat) {
      throw new UnauthorizedException();
    }

    await this.sessionsRepository.deleteAllSessionsExcept(deviceId, userId);
  }
}
