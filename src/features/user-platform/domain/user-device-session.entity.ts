import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { userDeviceSessionDict } from './dictionary/user-device-session.dict';
import { User } from './user.entity';
import { CreateDeviceSessionDto } from '../dto/create-device-session.dto';
import { BaseEntity } from '../../../common/domain/base.entity';

const { issuedAt, deviceName, deviceId, expirationDate } =
  userDeviceSessionDict;

@Entity()
export class UserDeviceSession extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  userId: string;

  @Column({ name: deviceId, type: 'uuid' })
  deviceId: string;

  @Column({ type: 'varchar' })
  ip: string;

  @Column({ name: deviceName, type: 'varchar' })
  deviceName: string;

  @Column({ name: issuedAt, type: 'integer' })
  issuedAt: number;

  @Column({ name: expirationDate, type: 'integer' })
  expirationDate: number;

  @ManyToOne(() => User, (user) => user.sessions)
  user: User;

  static create(dto: CreateDeviceSessionDto): UserDeviceSession {
    const session = new UserDeviceSession();

    session.userId = dto.userId;
    session.ip = dto.ip;
    session.deviceId = dto.deviceId;
    session.deviceName = dto.deviceName;
    session.issuedAt = dto.issuedAt;
    session.expirationDate = dto.expirationDate;

    return session;
  }

  updateSession(iat: number, exp: number) {
    this.issuedAt = iat;
    this.expirationDate = exp;
  }
}
