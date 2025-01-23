// import { CreateCommentDto } from '../../dto/create-comment.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { CommentsRepository } from '../../repositories/comments.repository';
// import { PostsRepository } from '../../repositories/posts.repository';
// import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../../../user-platform/repositories/users.repository';
import { CreateUserDto } from '../../dto/create-user.dto';
import { User } from '../../domain/user.entity';
import { CreateUserInputDto } from '../../api/input-dto/create-user.input-dto';
import { CryptoService } from '../crypto.service';

export class CreateUserCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserCommand, string>
{
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    // const isUserWithSameLoginOrEmailExist =
    //   await this.usersRepository.findByLoginOrEmail(dto.login, dto.email);
    // if (isUserWithSameLoginOrEmailExist) {
    //   throw new BadRequestException([
    //     {
    //       message: 'User already exists',
    //       field: 'email',
    //     },
    //   ]);
    // }

    const dto = command.dto;

    const hashedPassword = await this.cryptoService.createPasswordHash(
      dto.password,
    );

    const user = User.create({
      login: dto.login,
      email: dto.email,
      hashedPassword: hashedPassword,
      isConfirmed: true,
    });

    const userId = await this.usersRepository.createUser(user);
    return userId;
  }
}

/**
 * const isUserWithSameLoginOrEmailExist =
 *       await this.usersRepository.findByLoginOrEmail(dto.login, dto.email);
 *     if (isUserWithSameLoginOrEmailExist) {
 *       throw new BadRequestException([
 *         {
 *           message: 'User already exists',
 *           field: 'email',
 *         },
 *       ]);
 *     }
 *
 *     const passwordHash = await this.cryptoService.createPasswordHash(
 *       dto.password,
 *     );
 *
 *     const values: CreateUserDto = {
 *       email: dto.email,
 *       login: dto.login,
 *       password: passwordHash,
 *       confirmationCode: '',
 *       recoveryCode: '',
 *       isConfirmed: true,
 *     };
 *
 *     return this.usersRepository.create(values);
 */
