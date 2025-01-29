import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UserDeviceSessionsRepository } from '../../repositories/user-device-sessions.repository';

export class DeleteSessionCommand {
  constructor(
    public deviceId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteSessionCommand)
export class DeleteSessionUseCase
  implements ICommandHandler<DeleteSessionCommand, void>
{
  constructor(private sessionsRepository: UserDeviceSessionsRepository) {}

  async execute(command: DeleteSessionCommand): Promise<void> {
    const session = await this.sessionsRepository.findByDeviceId(
      command.deviceId,
    );

    if (!session) {
      throw new NotFoundException(
        `There is no session with deviceId: ${command.deviceId}`,
      );
    }

    if (session.userId !== command.userId) {
      throw new ForbiddenException();
    }

    await this.sessionsRepository.deleteSession(session.id);
  }
}
