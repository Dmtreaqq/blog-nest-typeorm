import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repositories/users.repository';
import { User } from '../../domain/user.entity';
import { CryptoService } from '../crypto.service';
import { BadRequestException } from '@nestjs/common';
import { RegistrationUserDto } from '../../api/input-dto/registration-user.dto';
import { EmailService } from '../../../communication/email.service';

export class RegisterUserCommand {
  constructor(public dto: RegistrationUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand, any>
{
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
    private emailService: EmailService,
  ) {}

  async execute(command: RegisterUserCommand): Promise<any> {
    const { email, login, password } = command.dto;
    const isUserExist = await this.usersRepository.findByLoginOrEmail(
      command.dto.login,
      command.dto.email,
    );

    if (isUserExist && isUserExist.email === email) {
      throw new BadRequestException([
        {
          message: 'Incorrect',
          field: 'email',
        },
      ]);
    }

    if (isUserExist && isUserExist.login === login) {
      throw new BadRequestException([
        {
          message: 'Incorrect',
          field: 'login',
        },
      ]);
    }

    const hashedPassword =
      await this.cryptoService.createPasswordHash(password);

    const user = User.create({
      login,
      email,
      hashedPassword,
      isConfirmed: false,
    });

    await this.usersRepository.createUser(user);

    this.emailService
      .sendConfirmationEmail(user.userMetaInfo.confirmationCode, user.email)
      .catch((e) => console.log(e));
  }
}
