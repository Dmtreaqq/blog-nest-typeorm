import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { userDict } from './dictionary/user.dict';
import { UserMetaInfo } from './user-meta-info.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';
const { createdAt, deletedAt } = userDict;

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  login: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ type: 'varchar' })
  email: string;

  @CreateDateColumn({ name: createdAt, type: 'timestamptz', default: 'now()' })
  createdAt: Date;

  @DeleteDateColumn({ name: deletedAt, type: 'timestamptz' })
  deletedAt: Date;

  @OneToOne(() => UserMetaInfo, (userMetaInfo) => userMetaInfo.user, {
    cascade: true,
  })
  userMetaInfo: UserMetaInfo;

  static create(dto: CreateUserDto): User {
    const user = new User();

    user.login = dto.login;
    user.password = dto.hashedPassword;
    user.email = dto.email;

    user.userMetaInfo = {
      user: user,
      isConfirmed: dto.isConfirmed,
      confirmationCode: randomUUID(),
      confirmationCodeExpirationDate: add(new Date(), {
        minutes: 3,
      }).toISOString(),
      recoveryCode: randomUUID(),
      recoveryCodeExpirationDate: add(new Date(), {
        minutes: 3,
      }).toISOString(),
    };

    return user;
  }

  markDeleted() {
    if (this.deletedAt !== null) {
      return;
    }

    this.deletedAt = new Date();
  }

  markConfirmed() {
    this.userMetaInfo.isConfirmed = true;
  }
}
