import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UsersRepository } from '../../repositories/users.repository';
import { BadRequestException } from '@nestjs/common';
import { EmailService } from '../../../communication/email.service';

export class RecoverUserPasswordCommand {
  constructor(public email: string) {}
}

@CommandHandler(RecoverUserPasswordCommand)
export class RecoverUserPasswordUseCase
  implements ICommandHandler<RecoverUserPasswordCommand, void>
{
  constructor(
    private usersRepository: UsersRepository,
    private emailService: EmailService,
  ) {}

  async execute(command: RecoverUserPasswordCommand): Promise<void> {
    const user = await this.usersRepository.findByLoginOrEmail(
      command.email,
      command.email,
    );

    if (!user) {
      return;
    }

    user.updateRecoveryData();

    await this.usersRepository.save(user);

    this.emailService
      .sendRecoverPasswordEmail(user.userMetaInfo.recoveryCode, command.email)
      .catch((e) => console.log(e));
  }
}
