import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from './config/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from './config/config.service';
import { PostsController } from './posts/posts.controller';
import { PostsModule } from './posts/posts.module';
import { CommonModule } from './common/common.module';
import { FeedbackModule } from './feedback/feedback.module';

// type, host, port, username, password, database, entities

@Module({
  imports: [
    CoreModule,
    AuthModule,
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: configService.dbType as any,
        host: configService.dbHost,
        port: configService.dbPort,
        username: configService.dbUsername,
        password: configService.dbPassword,
        database: configService.dbName,
        entities: ['./src/data/entities/*.ts'],
        synchronize: true
      }),
    }),
    PostsModule,
    CommonModule,
    FeedbackModule,
  ],
  controllers: [AppController, PostsController],
  providers: [],
})
export class AppModule {}
