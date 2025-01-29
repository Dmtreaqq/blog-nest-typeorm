import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { LoginUserDto } from '../../dto/login-user.dto';
import { randomUUID } from 'node:crypto';
import { UserContext } from '../../../../common/dto/user-context.dto';
import { JwtService } from '@nestjs/jwt';
import { CommonConfig } from '../../../../common/common.config';
import { UserPlatformConfig } from '../../config/user-platform.config';
import { UserDeviceSessionsRepository } from '../../repositories/user-device-sessions.repository';
import { UnauthorizedException } from '@nestjs/common';

export class LogoutUserCommand {
  constructor(
    public deviceId: string,
    public userId: string,
    public iat: number,
  ) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase
  implements ICommandHandler<LogoutUserCommand, any>
{
  constructor(
    private jwtService: JwtService,
    private commonConfig: CommonConfig,
    private sessionsRepository: UserDeviceSessionsRepository,
  ) {}

  async execute(command: LogoutUserCommand): Promise<any> {
    const session = await this.sessionsRepository.findByDeviceId(
      command.deviceId,
    );

    if (!session) {
      throw new UnauthorizedException();
    }

    if (session.issuedAt !== command.iat) {
      throw new UnauthorizedException();
    }

    await this.sessionsRepository.deleteSession(session.id);
  }
}
