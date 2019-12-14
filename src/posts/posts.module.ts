import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { CommonModule } from '../common/common.module';
import { User } from '../data/entities/user';
import { PostEntity } from '../data/entities/post';
import { ImageEntity } from '../data/entities/image';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, User, ImageEntity]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    CommonModule
  ],
  providers: [PostsService],
  controllers: [PostsController],
  exports: [PostsService],
})
export class PostsModule {}
