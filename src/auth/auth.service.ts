import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../core/services/users.service';
import { UserLoginDTO } from '../models/user/user-login-dto';
import { JwtPayload } from '../core/interfaces/jwt-payload';
import { User } from '../data/entities/user';
import { UserNotFoundException } from '../common/exceptions/user/user-not-found.exception';
import * as bcrypt from 'bcrypt';
import { InvalidPasswordException } from '../common/exceptions/user/invalid-password-exception';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  public async logIn(user: UserLoginDTO) {
		const checkExist = await this.usersService.findUserByEmail(user.email);

		if (!checkExist) {
			throw new UserNotFoundException('User with such email doesnt exist!', HttpStatus.BAD_REQUEST);
		}

		if (!(await this.valiteUserPass(user, checkExist))) {
			throw new InvalidPasswordException('Invalid password!', HttpStatus.FORBIDDEN);
		}

		const payload = { email: user.email };
		const token = await this.jwtService.signAsync(payload);

		return { user: {name: checkExist.name,email: user.email, id: checkExist.id}, token};
	}

  async validateUser(payload: JwtPayload): Promise<User | undefined> {
    return await this.usersService.validate(payload);
  }

  public async valiteUserPass(user, userEntity): Promise<boolean> {
    return await bcrypt.compare(user.password, userEntity.password);
  }
}
