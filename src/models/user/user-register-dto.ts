import { IsEmail, IsString, Matches } from 'class-validator';

export class UserRegisterDTO {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/)
  password: string;
}
