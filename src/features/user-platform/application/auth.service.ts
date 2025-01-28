import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from '../repositories/users.repository';
import { CryptoService } from './crypto.service';
import { EmailDto } from '../api/input-dto/email.dto';
import { EmailService } from '../../communication/email.service';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
    private emailService: EmailService,
  ) {}

  async validateUser(
    loginOrEmail: string,
    password: string,
  ): Promise<{ id: string }> {
    const user = await this.usersRepository.findByLoginOrEmail(
      loginOrEmail,
      loginOrEmail,
    );
    if (!user) {
      throw new UnauthorizedException();
    }

    const compareResult = await this.cryptoService.comparePasswords({
      password,
      hash: user.password,
    });

    if (compareResult) {
      return { id: user.id };
    }

    throw new UnauthorizedException();
  }

  async resendConfirmRegistration(dto: EmailDto) {
    const user = await this.usersRepository.findByLoginOrEmail(
      dto.email,
      dto.email,
    );
    if (!user) {
      throw new BadRequestException([
        {
          message: 'Invalid email',
          field: 'email',
        },
      ]);
    }

    if (user.userMetaInfo.isConfirmed === true) {
      throw new BadRequestException([
        {
          message: 'Email already confirmed',
          field: 'email',
        },
      ]);
    }

    user.updateConfirmationData();

    this.emailService
      .sendConfirmationEmail(user.userMetaInfo.confirmationCode, dto.email)
      .catch((e) => console.log(e));
  }
}
