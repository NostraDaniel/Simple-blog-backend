import { Controller, Get, Post, Query, Param, Put, UseGuards, Body, ValidationPipe, Delete, UseInterceptors, UploadedFile, Res, UploadedFiles, UseFilters } from '@nestjs/common';
import { ShowPostDTO } from '../models/post/show-post-dto';
import { AuthGuard } from '@nestjs/passport';
import { NewPostDTO } from '../models/post/new-post-dto';
import { User } from '../data/entities/user';
import { AuthUser } from '../common/decorators/user.decorator';
import { PostsService } from './posts.service';
import { diskStorage } from  'multer';
import { extname } from  'path';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ShowImageDTO } from '../models/post/show-image-dto';
import { PostEntity } from '../data/entities/post';
import { UploadedFileImageDTO } from '../models/post/uploaded-file-image-dto';
import { CommonExceptionFilter } from '../common/filters/common-exception.filter';
import { ValidationExceptionFilter } from '../common/filters/validation-exception.filter';
import { UpdatePostDTO } from '../models/post/update-post-dto';

@Controller('posts')
@UseFilters(new CommonExceptionFilter())
export class PostsController {

  constructor(
    private readonly postsService: PostsService,
  ) {}
  
  // Get posts by page, posts per page and filter
  @Get()
  async getPosts(
    @Query('page') page: number,
    @Query('posts_per_page') postsPerPage: number,
    @Query('filter') filter: string
    ): Promise<{postsCount: number,posts:PostEntity[]}> {
    return await this.postsService.getAllPosts(page, postsPerPage, filter);
  }

  // Creates posts with validation
  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseFilters(new ValidationExceptionFilter())
  async createNewPost
    (
      @Body(new ValidationPipe({
        // transform: true,
        // whitelist: true,
      })) post: NewPostDTO,
      @AuthUser() user: User
    ): Promise<PostEntity> {
    return await this.postsService.createNewPost(post, user);
  }

  @Put(':PostId')
  @UseGuards(AuthGuard('jwt'))
  public async updatePost(
    @Param('PostId') id: string,
    @Body(new ValidationPipe({
      // transform: true,
      // whitelist: true,
    })) body: UpdatePostDTO,
    @AuthUser() user: User): Promise<PostEntity> {
      console.log('telotooooo',body);
      console.log('-------------------');
    return await this.postsService.updatePost(id, body, user);
  }

  @Delete(':PostId')
  @UseGuards(AuthGuard('jwt'))
  public async deletePost(@Param('PostId') id: string, @AuthUser() user: User): Promise<PostEntity> {
    return await this.postsService.deletePost(id, user);
  }

  @Get('newest')
  async getNewestPosts(): Promise<ShowPostDTO[]> {
    return this.postsService.getNewestPosts();
  }

  @Get('front-page')
  async getFrontPagePosts(): Promise<ShowPostDTO[]> {
    return this.postsService.getFrontPagePosts();
  }

  @Get(':PostId')
  public async getSinglePost(@Param('PostId') id: string): Promise<any> {
    return await this.postsService.getSinglePost(id);
  }

  @Post('image')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('image',
    {
      storage: diskStorage({
        destination: './postImages', 
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');

          return cb(null, `${randomName}${extname(file.originalname)}`)
        },
        limits: {
          fileSize: 10
        }
      })
    }
  ))
  public async uploadImage(@UploadedFile() file): Promise<UploadedFileImageDTO> {
    return this.postsService.uploadImage(file);
  }

  @Post('images')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FilesInterceptor('gallery[]',12,{
    storage: diskStorage({
      destination: './postImages',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');

          return cb(null, `${randomName}${extname(file.originalname)}`)
      },
      limits: {
        fileSize: 10
      }
    })
  }))
  public async uploadImages(@UploadedFiles() files): Promise<ShowImageDTO[]> {
    return this.postsService.uploadImages(files);
  }

  @Get('postImages/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'postImages'});
  }
}
