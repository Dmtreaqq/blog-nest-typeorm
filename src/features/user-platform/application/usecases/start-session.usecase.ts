import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repositories/users.repository';
import { User } from '../../domain/user.entity';
import { CreateUserInputDto } from '../../api/input-dto/create-user.input-dto';
import { CryptoService } from '../crypto.service';
import { BadRequestException } from '@nestjs/common';
import { CreateDeviceSessionDto } from '../../dto/create-device-session.dto';
import { UserDeviceSessionsRepository } from '../../repositories/user-device-sessions.repository';
import { UserDeviceSession } from '../../domain/user-device-session.entity';

export class StartSessionCommand {
  constructor(public dto: CreateDeviceSessionDto) {}
}

@CommandHandler(StartSessionCommand)
export class StartSessionUseCase
  implements ICommandHandler<StartSessionCommand, void>
{
  constructor(private sessionsRepository: UserDeviceSessionsRepository) {}

  async execute(command: StartSessionCommand): Promise<void> {
    const session = UserDeviceSession.create(command.dto);

    await this.sessionsRepository.save(session);
  }
}
