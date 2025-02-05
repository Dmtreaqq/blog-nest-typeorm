import {
  CreateDateColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm';
import { baseDict } from './base.dict';

const { createdAt, updatedAt, deletedAt } = baseDict;

export class BaseEntity {
  @CreateDateColumn({ name: createdAt, type: 'timestamptz' })
  createdAt?: Date;

  @UpdateDateColumn({ name: updatedAt, type: 'timestamptz' })
  updatedAt?: Date;

  @DeleteDateColumn({ name: deletedAt, type: 'timestamptz' })
  deletedAt?: Date;

  @VersionColumn({ default: 1 })
  version?: number;
}
