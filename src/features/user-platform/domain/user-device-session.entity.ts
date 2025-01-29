import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { userDeviceSessionDict } from './dictionary/user-device-session.dict';
import { User } from './user.entity';

const { issuedAt, deviceName, deviceId, expirationDate } =
  userDeviceSessionDict;

@Entity()
export class UserDeviceSession {
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
}
