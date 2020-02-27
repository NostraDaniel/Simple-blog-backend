import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../core/services/users.service';
import { UserLoginDTO } from '../models/user/user-login-dto';
import { JwtPayload } from '../core/interfaces/jwt-payload';
import { User } from '../data/entities/user';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signIn(user: UserLoginDTO): Promise<{user: User, token: string}> {
    const userFound = await this.usersService.signIn(user);
    
    if (userFound) {
      const token = await this.jwtService.sign({email: userFound.email});
      return { user: userFound, token };
    }

    return null;
  }

  async validateUser(payload: JwtPayload): Promise<User | undefined> {
    console.log('validaciq na user-a');
    return await this.usersService.validate(payload);
  }
}
