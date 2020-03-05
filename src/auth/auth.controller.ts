import { Controller, Post, Body, ValidationPipe, UseFilters, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../core/services/users.service';
import { UserLoginDTO } from '../models/user/user-login-dto';
import { UserRegisterDTO } from '../models/user/user-register-dto';
import { CommonExceptionFilter } from '../common/filters/common-exception.filter';

@Controller('')
@UseFilters(new CommonExceptionFilter())
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
  
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(new ValidationPipe({
    transform: true,
    whitelist: true,
  })) user: UserLoginDTO): Promise<{user: {name: string, email:string, id: string}, token: string}> {
    return await this.authService.logIn(user);
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body(new ValidationPipe({
    transform: true,
    whitelist: true,
  })) user: UserRegisterDTO): Promise<any> {
    return await this.usersService.register(user);
  }
}
