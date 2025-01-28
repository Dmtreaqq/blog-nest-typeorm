import {
  BadRequestException,
  Body,
  Controller,
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
import { CryptoService } from '../application/crypto.service';
import { RegisterUserCommand } from '../application/usecases/register-user.usecase';
import { ConfirmationCodeDto } from './input-dto/confirmation-code.dto';
import { ConfirmUserCommand } from '../application/usecases/confirm-user.usecase';

@Controller('auth')
export class AuthController {
  constructor(private commandBus: CommandBus) {}

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
        ip: ip,
        userAgent: userAgent,
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
}
