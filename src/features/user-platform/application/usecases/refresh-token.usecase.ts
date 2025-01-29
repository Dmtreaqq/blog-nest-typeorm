import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { randomUUID } from 'node:crypto';
import { UserContext } from '../../../../common/dto/user-context.dto';
import { JwtService } from '@nestjs/jwt';
import { CommonConfig } from '../../../../common/common.config';
import { UserPlatformConfig } from '../../config/user-platform.config';

export class RefreshTokenCommand {
  constructor(
    public deviceId: string,
    public userId: string,
    public oldIat: number,
  ) {}
}

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenUseCase
  implements ICommandHandler<RefreshTokenCommand, any>
{
  constructor(
    private jwtService: JwtService,
    private commonConfig: CommonConfig,
    private userPlatformConfig: UserPlatformConfig,
  ) {}

  async execute(command: RefreshTokenCommand): Promise<any> {
    const payload = { id: command.userId } as UserContext;

    const tokens = {
      accessToken: await this.jwtService.signAsync(payload, {
        secret: this.commonConfig.accessTokenSecret,
        expiresIn: this.userPlatformConfig.accessTokenExpiration + 's',
      }),
      refreshToken: await this.jwtService.signAsync(
        { ...payload, deviceId: command.deviceId, version: randomUUID() + 1 },
        {
          secret: this.commonConfig.refreshTokenSecret,
          expiresIn: this.userPlatformConfig.refreshTokenExpiration + 's',
        },
      ),
    };

    // await this.userDeviceSessionsService.updateDeviceSession(
    //   deviceId,
    //   userId,
    //   newIat,
    //   newExp,
    //   iat,
    // );

    const decodedRefreshToken = this.jwtService.decode(tokens.refreshToken);
    tokens['iat'] = decodedRefreshToken.iat;
    tokens['exp'] = decodedRefreshToken.exp;

    return tokens;
  }
}
