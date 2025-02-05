import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { userDict } from './dictionary/user.dict';
import { UserMetaInfo } from './user-meta-info.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns/add';
import { UserDeviceSession } from './user-device-session.entity';
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

  @CreateDateColumn({ name: createdAt, type: 'timestamptz' })
  createdAt: Date;

  @DeleteDateColumn({ name: deletedAt, type: 'timestamptz' })
  deletedAt: Date;

  @OneToOne(() => UserMetaInfo, (userMetaInfo) => userMetaInfo.user, {
    cascade: true,
  })
  userMetaInfo: UserMetaInfo;

  @OneToMany(() => UserDeviceSession, (session) => session.user)
  sessions: UserDeviceSession[];

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

  markConfirmed() {
    this.userMetaInfo.isConfirmed = true;
  }

  updateConfirmationData() {
    this.userMetaInfo.confirmationCode = randomUUID();
    this.userMetaInfo.confirmationCodeExpirationDate = add(new Date(), {
      minutes: 3,
    }).toISOString();
  }

  updateRecoveryData() {
    this.userMetaInfo.recoveryCode = randomUUID();
    this.userMetaInfo.recoveryCodeExpirationDate = add(new Date(), {
      minutes: 3,
    }).toISOString();
  }

  updatePassword(passwordHash: string) {
    this.password = passwordHash;
  }
}
