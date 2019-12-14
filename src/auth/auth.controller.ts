import { Controller, Post, Body, ValidationPipe, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../core/services/users.service';
import { UserLoginDTO } from '../models/user/user-login-dto';
import { UserRegisterDTO } from '../models/user/user-register-dto';
import { User } from '../data/entities/user';

@Controller('')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body(new ValidationPipe({
    transform: true,
    whitelist: true,
  })) user: UserLoginDTO): Promise<{user: User, token: string}> {
    const authObject = await this.authService.signIn(user);

    if (!authObject) {
      throw new BadRequestException(`Wrong credentials!`);
    }

    return authObject;
  }

  @Post('register')
  async register(@Body(new ValidationPipe({
    transform: true,
    whitelist: true,
  })) user: UserRegisterDTO): Promise<any> {
    console.log('here');
    console.log(user);
    return await this.usersService.register(user);
  }
}
