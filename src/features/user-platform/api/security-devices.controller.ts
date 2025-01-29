import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { JwtRefreshAuthGuard } from '../../../common/guards/jwt-refresh-auth.guard';
import { GetUser } from '../../../common/decorators/get-user.decorator';
import { UserDeviceSessionQueryRepository } from '../repositories/query/user-device-session-query.repository';
import { UserDeviceSessionsViewDto } from './view-dto/user-device-sessions.view-dto';
import { UserContext } from '../../../common/dto/user-context.dto';
import { CommandBus } from '@nestjs/cqrs';
import { DeleteSessionCommand } from '../application/usecases/delete-session.usecase';
import { DeleteSessionExceptCommand } from '../application/usecases/delete-session-except.usecase';

@UseGuards(JwtRefreshAuthGuard)
@Controller('security/devices')
export class SecurityDevicesController {
  constructor(
    private userDeviceSessionsQueryRepository: UserDeviceSessionQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  async getAllDeviceSessions(
    @GetUser() userContext: UserContext,
  ): Promise<UserDeviceSessionsViewDto[]> {
    return this.userDeviceSessionsQueryRepository.getAllSessions(
      userContext.id,
    );
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAllDeviceSession(
    @GetUser() userContext: { id: string; deviceId: string },
  ) {
    await this.commandBus.execute(
      new DeleteSessionExceptCommand(userContext.deviceId, userContext.id),
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteDeviceSession(
    @Param() params: { id: string },
    @GetUser()
    userContext: { id: string; deviceId: string },
  ) {
    await this.commandBus.execute(
      // deviceId
      new DeleteSessionCommand(params.id, userContext.id),
    );
  }
}
