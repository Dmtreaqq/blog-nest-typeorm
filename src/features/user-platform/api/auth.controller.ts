import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Ip,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { add } from 'date-fns/add';
import { Response } from 'express';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserAgent } from '../../../common/decorators/user-agent.decorator';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { UserContext } from '../../../common/dto/user-context.dto';
import { CommandBus } from '@nestjs/cqrs';
import { LoginUserCommand } from '../application/usecases/login-user.usecase';
import { RegistrationUserDto } from './input-dto/registration-user.dto';
import { RegisterUserCommand } from '../application/usecases/register-user.usecase';
import { ConfirmationCodeDto } from './input-dto/confirmation-code.dto';
import { ConfirmUserCommand } from '../application/usecases/confirm-user.usecase';
import { EmailDto } from './input-dto/email.dto';
import { AuthService } from '../application/auth.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { MeViewDto } from './view-dto/users.view-dto';
import { UsersQueryRepository } from '../repositories/query/user-query.repository';
import { RecoverUserPasswordCommand } from '../application/usecases/recover-password.usecase';
import { ConfirmNewPasswordDto } from './input-dto/confirm-new-password.dto';
import { ConfirmPasswordCommand } from '../application/usecases/confirm-password.usecase';
import { StartSessionCommand } from '../application/usecases/start-session.usecase';
import { JwtRefreshAuthGuard } from '../../../common/guards/jwt-refresh-auth.guard';
import { RefreshTokenCommand } from '../application/usecases/refresh-token.usecase';
import { UpdateSessionCommand } from '../application/usecases/update-session.usecase';
import { UserDeviceSessionsRepository } from '../repositories/user-device-sessions.repository';
import { LogoutUserCommand } from '../application/usecases/logout-user.usecase';
import { ThrottlerGuard } from '@nestjs/throttler';

@UseGuards(ThrottlerGuard)
@Controller('auth')
export class AuthController {
  constructor(
    private commandBus: CommandBus,
    private authService: AuthService,
    private usersQueryRepository: UsersQueryRepository,
    private sessionRepo: UserDeviceSessionsRepository,
  ) {}

  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Ip() ip: string,
    @UserAgent() userAgent: string,
    @Res({ passthrough: true }) res: Response,
    @GetUser() userContext: UserContext,
  ) {
    const loginResult = await this.commandBus.execute(
      new LoginUserCommand({
        userId: userContext.id,
      }),
    );

    // MAYBE START SESSION HERE ?
    await this.commandBus.execute(
      new StartSessionCommand({
        userId: userContext.id,
        deviceId: loginResult.deviceId,
        deviceName: userAgent ?? 'Unknown name',
        ip,
        issuedAt: loginResult.iat,
        expirationDate: loginResult.exp,
      }),
    );

    res.cookie('refreshToken', loginResult.refreshToken, {
      httpOnly: true,
      secure: true,
      expires: add(new Date(), { hours: 24 }),
    });

    return {
      accessToken: loginResult.accessToken,
    };
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration')
  async registration(@Body() dto: RegistrationUserDto) {
    await this.commandBus.execute(new RegisterUserCommand(dto));

    // MAYBE DO HERE SENDING EMAIL ??
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-confirmation')
  async confirmRegistration(@Body() dto: ConfirmationCodeDto) {
    await this.commandBus.execute(new ConfirmUserCommand(dto.code));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-email-resending')
  async resendConfirmRegistration(@Body() dto: EmailDto) {
    await this.authService.resendConfirmRegistration(dto);

    // TODO: RESEND EMAIL HERE ?
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password-recovery')
  async recoverPassword(@Body() dto: EmailDto) {
    await this.commandBus.execute(new RecoverUserPasswordCommand(dto.email));
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('new-password')
  async confirmNewPassword(@Body() dto: ConfirmNewPasswordDto) {
    await this.commandBus.execute(new ConfirmPasswordCommand(dto));
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMe(@GetUser() userContext: UserContext): Promise<MeViewDto> {
    const user = await this.usersQueryRepository.findUserByIdOrThrow(
      userContext.id,
    );

    return MeViewDto.mapToView(user);
  }

  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('refresh-token')
  async refreshToken(
    @GetUser() userContext: { id: string; deviceId: string; iat: number },
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ accessToken: string }> {
    const { deviceId, id, iat } = userContext;

    const tokens = await this.commandBus.execute(
      new RefreshTokenCommand(deviceId, id, iat),
    );
    const { iat: newIat, exp } = tokens;

    await this.commandBus.execute(
      new UpdateSessionCommand(deviceId, id, newIat, exp, iat),
    );

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      expires: add(new Date(), { hours: 24 }),
    });

    return { accessToken: tokens.accessToken };
  }

  @UseGuards(JwtRefreshAuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('logout')
  async logout(
    @GetUser() userContext: { deviceId: string; id: string; iat: number },
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.commandBus.execute(
      new LogoutUserCommand(
        userContext.deviceId,
        userContext.id,
        userContext.iat,
      ),
    );

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      expires: add(new Date(), { hours: 24 }),
    });
  }
}
