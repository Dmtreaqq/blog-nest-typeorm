import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
// import { UsersQueryRepository } from '../repositories/query/users.query-repository';
import { UserViewDto } from './view-dto/users.view-dto';
// import { UsersService } from '../application/users.service';
import { CreateUserInputDto } from './input-dto/create-user.input-dto';
import { BasePaginationViewDto } from '../../../common/dto/base-pagination.view-dto';
import { GetUsersQueryParams } from './input-dto/get-users-query-params.input-dto';
import { BasicAuthGuard } from '../../../common/guards/basic-auth.guard';
import { IdInputDto } from '../../../common/dto/id.input-dto';
import { CommandBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/usecases/create-user.usecase';
import { UsersQueryRepository } from '../repositories/query/user-query.repository';
import { DeleteUserCommand } from '../application/usecases/delete-user.usecase';

@Controller('sa/users')
export class UsersController {
  constructor(
    private commandBus: CommandBus,
    private usersQueryRepository: UsersQueryRepository,
  ) {}

  @UseGuards(BasicAuthGuard)
  @Get(':id')
  async getById(@Param() params: IdInputDto): Promise<UserViewDto> {
    return this.usersQueryRepository.findUserById(params.id);
  }

  @UseGuards(BasicAuthGuard)
  @Get()
  async getAll(
    @Query() query: GetUsersQueryParams,
  ): Promise<BasePaginationViewDto<UserViewDto[]>> {
    return this.usersQueryRepository.findAllUsers(query);
  }

  @UseGuards(BasicAuthGuard)
  @Post()
  async createUser(@Body() body: CreateUserInputDto): Promise<UserViewDto> {
    const userId = await this.commandBus.execute(new CreateUserCommand(body));

    return this.usersQueryRepository.findUserById(userId);
  }

  // TODO: DELETE ALL USER SESSIONS
  @UseGuards(BasicAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param() params: IdInputDto): Promise<void> {
    await this.commandBus.execute(new DeleteUserCommand(params.id));
  }
}
