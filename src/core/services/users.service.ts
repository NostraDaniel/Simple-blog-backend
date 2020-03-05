import { Injectable, Post, HttpException, HttpStatus } from '@nestjs/common';
import { User } from '../../data/entities/user';
import { UserLoginDTO } from '../../models/user/user-login-dto';
import { JwtPayload } from '../interfaces/jwt-payload';
import { UserRegisterDTO } from '../../models/user/user-register-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowUserDTO } from '../../models/user/show-user-dto';
import { UserAlreadyExistException } from '../../common/exceptions/user/user-already-exit.exception';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async signIn(user: UserLoginDTO): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        ...user,
      },
    });
  }

  async  register(user: UserRegisterDTO): Promise<ShowUserDTO | undefined> {
    const checkExist: User = await this.findUserByEmail(user.email);

    if (!!checkExist) {
      throw new UserAlreadyExistException('User with such email already exists!')
    }

    const passwordHash = await this.hashPassword(user.password);
    user.password = passwordHash;

    const newUser = await this.userRepository.save(user)

    return plainToClass(ShowUserDTO, newUser, {excludeExtraneousValues: true});
  }

  async validate(payload: JwtPayload): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        ...payload,
      },
    });
  }

  public async findUserByEmail(email: string): Promise<User> | undefined {
    const user = await this.userRepository.findOne({ email });
    return user;
  }

  public async hashPassword(password): Promise<string> {
    return await bcrypt.hash(password, 10)
  }
}
