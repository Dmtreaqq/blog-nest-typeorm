import { Repository } from 'typeorm';
import { User } from '../domain/user.entity';
import { InjectRepository } from '@nestjs/typeorm';

export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async save(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async findByLogin(login: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ login });
  }

  async findByLoginOrEmail(login: string, email: string): Promise<User | null> {
    // TODO: Здесь метод репозитория, но я не возвращаю мета данньіе
    const user = await this.usersRepository
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.userMetaInfo', 'umi')
      .where('u.login = :login', { login })
      .orWhere('u.email = :email', { email })
      .getOne();

    if (!user) {
      return null;
    }

    return user;
  }

  async findByConfirmationCode(code: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        userMetaInfo: {
          confirmationCode: code,
        },
      },
      relations: ['userMetaInfo'],
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async findByRecoveryCode(code: string): Promise<User | null> {
    const user = await this.usersRepository.findOne({
      where: {
        userMetaInfo: {
          recoveryCode: code,
        },
      },
      relations: ['userMetaInfo'],
    });

    if (!user) {
      return null;
    }

    return user;
  }

  async deleteUser(id: string) {
    await this.usersRepository.softDelete({ id });
  }
}
