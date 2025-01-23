/**
 *   @Column({ type: 'boolean' })
 *   isConfirmed: boolean;
 *
 *   @Column({ type: 'varchar' })
 *   confirmationCode: string;
 *
 *   @Column({ type: 'varchar' })
 *   confirmationCodeExpirationDate: string;
 *
 *   @Column({ type: 'varchar' })
 *   recoveryCode: string;
 *
 *   @Column({ type: 'varchar' })
 *   recoveryCodeExpirationDate: string;
 */

export const userMetaInfoDict = {
  isConfirmed: 'is_confirmed',
  confirmationCode: 'confirmation_code',
  confirmationCodeExpirationDate: 'confirmation_exp_date',
  recoveryCode: 'recovery_code',
  recoveryCodeExpirationDate: 'recovery_exp_date',
};
