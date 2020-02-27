import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { CoreModule } from '../core/core.module';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { ConfigModule } from '../config/config.module';
import { config } from '../common/config';

@Module({
  imports: [
    CoreModule,
    ConfigModule,
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.registerAsync({
      useFactory: async () => ({
        secretOrPrivateKey: config.jwtSecret,
        signOptions: {
          expiresIn: config.expiresIn,
        },
      }),
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
