import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseTypeEntity } from '../../../common/domain/baseTypeEntity';

@Entity()
export class Blog extends BaseTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'varchar' })
  websiteUrl: string;

  @Column({ type: 'boolean' })
  isMembership: boolean;
}
