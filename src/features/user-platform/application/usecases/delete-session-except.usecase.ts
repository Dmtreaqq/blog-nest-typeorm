import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserDeviceSessionsRepository } from '../../repositories/user-device-sessions.repository';

export class DeleteSessionExceptCommand {
  constructor(
    public deviceId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteSessionExceptCommand)
export class DeleteSessionExceptUseCase
  implements ICommandHandler<DeleteSessionExceptCommand, void>
{
  constructor(private sessionsRepository: UserDeviceSessionsRepository) {}

  async execute(command: DeleteSessionExceptCommand): Promise<void> {
    const { deviceId, userId } = command;
    await this.sessionsRepository.deleteAllSessionsExcept(deviceId, userId);
  }
}
