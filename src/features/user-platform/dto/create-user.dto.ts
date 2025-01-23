export class CreateUserDto {
  login: string;
  email: string;
  hashedPassword: string;
  isConfirmed: boolean;
}
