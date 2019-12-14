import { Injectable, Post } from '@nestjs/common';
import { User } from '../../data/entities/user';
import { UserLoginDTO } from '../../models/user/user-login-dto';
import { JwtPayload } from '../interfaces/jwt-payload';
import { UserRegisterDTO } from '../../models/user/user-register-dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../../data/entities/role';
import { UserRole } from '../../common/enums/user-role.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(User) private readonly rolesRepository: Repository<Role>,
  ) {}

  async signIn(user: UserLoginDTO): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        ...user,
      },
    });
  }

  async register(user: UserRegisterDTO): Promise<User | undefined> {
    const basicRole = await this.rolesRepository.findOne({
      name: UserRole.Basic,
    });
    const savedUser = await this.userRepository.save({
      ...user,
      roles: [basicRole],
    });

    return savedUser;
  }

  async validate(payload: JwtPayload): Promise<User | undefined> {
    return await this.userRepository.findOne({
      where: {
        ...payload,
      },
    });
  }
}
