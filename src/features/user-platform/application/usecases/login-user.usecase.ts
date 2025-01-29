import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repositories/users.repository';
import { User } from '../../domain/user.entity';
import { BadRequestException } from '@nestjs/common';
import { LoginUserDto } from '../../dto/login-user.dto';
import { randomUUID } from 'node:crypto';
import { UserContext } from '../../../../common/dto/user-context.dto';
import { JwtService } from '@nestjs/jwt';
import { CommonConfig } from '../../../../common/common.config';
import { UserPlatformConfig } from '../../config/user-platform.config';

export class LoginUserCommand {
  constructor(public dto: LoginUserDto) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase
  implements ICommandHandler<LoginUserCommand, any>
{
  constructor(
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private commonConfig: CommonConfig,
    private userPlatformConfig: UserPlatformConfig,
  ) {}

  async execute(command: LoginUserCommand): Promise<any> {
    const { userId, userAgent, ip } = command.dto;
    const payload = { id: userId } as UserContext;
    const deviceId = randomUUID();

    const tokens = {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.commonConfig.accessTokenSecret,
        expiresIn: this.userPlatformConfig.accessTokenExpiration + 's',
      }),
      refreshToken: await this.jwtService.signAsync(
        { ...payload, deviceId, version: randomUUID() + 1 },
        {
          secret: this.commonConfig.refreshTokenSecret,
          expiresIn: this.userPlatformConfig.refreshTokenExpiration + 's',
        },
      ),
      deviceId,
    };

    // TODO: Move to usecase
    // START SESSION
    const decodedRefreshToken = this.jwtService.decode(tokens.refreshToken);
    tokens['iat'] = decodedRefreshToken.iat;
    tokens['exp'] = decodedRefreshToken.exp;

    // await this.userDeviceSessionsService.createDeviceSession({
    //   userId,
    //   deviceId,
    //   ip: ip ?? 'Unknown Ip',
    //   issuedAt: decodedRefreshToken.iat,
    //   expirationDate: decodedRefreshToken.exp,
    //   deviceName: userAgent ?? 'Unknown name',
    // });

    return tokens;
  }
}
