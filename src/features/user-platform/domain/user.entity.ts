import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity, JoinColumn, OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { userDict } from './dictionary/user.dict';
import { UserMetaInfo } from './user-meta-info.entity';

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

  @OneToOne(() => UserMetaInfo)
  userMetaInfo: UserMetaInfo;
}
