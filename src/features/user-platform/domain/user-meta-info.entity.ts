import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';
import { userMetaInfoDict } from './dictionary/user-meta-info.dict';
import { User } from './user.entity';

const {
  isConfirmed,
  confirmationCode,
  confirmationCodeExpirationDate,
  recoveryCodeExpirationDate,
  recoveryCode,
} = userMetaInfoDict;

@Entity()
export class UserMetaInfo {
  @PrimaryColumn()
  userId?: string;

  @Column({ name: isConfirmed, type: 'boolean' })
  isConfirmed: boolean;

  @Column({ name: confirmationCode, type: 'varchar' })
  confirmationCode: string;

  @Column({
    name: confirmationCodeExpirationDate,
    type: 'timestamptz',
    default: 'now()',
  })
  confirmationCodeExpirationDate: string;

  @Column({ name: recoveryCode, type: 'varchar' })
  recoveryCode: string;

  @Column({
    name: recoveryCodeExpirationDate,
    type: 'timestamptz',
    default: 'now()',
  })
  recoveryCodeExpirationDate: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
