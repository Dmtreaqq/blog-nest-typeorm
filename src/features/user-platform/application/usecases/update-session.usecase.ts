import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UnauthorizedException } from '@nestjs/common';
import { UserDeviceSessionsRepository } from '../../repositories/user-device-sessions.repository';

export class UpdateSessionCommand {
  constructor(
    public deviceId: string,
    public userId: string,
    public newIat: number,
    public newExp: number,
    public oldIat: number,
  ) {}
}

@CommandHandler(UpdateSessionCommand)
export class UpdateSessionUseCase
  implements ICommandHandler<UpdateSessionCommand, void>
{
  constructor(private sessionsRepository: UserDeviceSessionsRepository) {}

  async execute(command: UpdateSessionCommand): Promise<void> {
    const session = await this.sessionsRepository.findByDeviceId(
      command.deviceId,
    );

    if (!session) {
      throw new UnauthorizedException(
        `There is no session with deviceId: ${command.deviceId}`,
      );
    }

    if (session.issuedAt !== command.oldIat) {
      // TODO: we can delete session I believe
      throw new UnauthorizedException('Session already invalid');
    }

    session.updateSession(command.newIat, command.newExp);


    await this.sessionsRepository.save(session);
  }
}
