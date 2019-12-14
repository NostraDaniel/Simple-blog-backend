import { Controller, Get, Post, Query, Param, Put, UseGuards, Body, ValidationPipe, Delete, UseInterceptors, UploadedFile, Res, UploadedFiles } from '@nestjs/common';
import { ShowPostDTO } from '../models/post/show-post-dto';
import { AuthGuard } from '@nestjs/passport';
import { NewPostDTO } from '../models/post/new-post-dto';
import { User } from '../data/entities/user';
import { AuthUser } from '../common/decorators/user.decorator';
import { PostsService } from './posts.service';
import { diskStorage } from  'multer';
import { extname } from  'path';
import { FileInterceptor, FileFieldsInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ShowImageDTO } from '../models/post/show-image-dto';
import { ImageEntity } from '../data/entities/image';
import { PostEntity } from '../data/entities/post';
import { UploadedFileImageDTO } from '../models/post/uploaded-file-image-dto';

@Controller('posts')
export class PostsController {

  constructor(
    private readonly postsService: PostsService,
  ) {}

  @Get()
  async getPosts(
    @Query('page') page: number,
    @Query('posts_per_page') postsPerPage: number,
    @Query('filter') filter: string
    ): Promise<{postsCount: number,posts:PostEntity[]}> {
    return await this.postsService.getAllPosts(page, postsPerPage, filter);
  }

  @Post()
  // @UseGuards(AuthGuard())
  async createNewPost
    (
      @Body(new ValidationPipe({
        transform: true,
      })) post: NewPostDTO,
      @AuthUser() user: User
    ): Promise<PostEntity> {
      console.log('cak', post);
    return await this.postsService.createNewPost(post, user);
  }

  @Put(':PostId')
  @UseGuards(AuthGuard())
  public async updatePost(
    @Param('PostId') id: string,
    @Body(new ValidationPipe({
      transform: true,
      whitelist: true,
    })) body: Partial<NewPostDTO>,
    @AuthUser() user: User): Promise<PostEntity> {
    return await this.postsService.updatePost(id, body, user);
  }

  @Delete(':PostId')
  @UseGuards(AuthGuard())
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
  @UseInterceptors(FileInterceptor('image',
    {
      storage: diskStorage({
        destination: './postImages', 
        filename: (req, file, cb) => {
          const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');

          return cb(null, `${randomName}${extname(file.originalname)}`)
        }
      })
    }
  ))
  public async uploadImage(@UploadedFile() file): Promise<UploadedFileImageDTO> {
    return this.postsService.uploadImage(file);
  }

  @Post('images')
  @UseInterceptors(FilesInterceptor('gallery[]',12,{
    storage: diskStorage({
      destination: './postImages',
      filename: (req, file, cb) => {
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('');

          return cb(null, `${randomName}${extname(file.originalname)}`)
      }
    })
  }))
  public async uploadImages(@UploadedFiles() files): Promise<ShowImageDTO[]> {
    console.log('uploadvane na snimkite ot galeriq');
    return this.postsService.uploadImages(files);
  }

  @Get('postImages/:fileId')
  async serveAvatar(@Param('fileId') fileId, @Res() res): Promise<any> {
    res.sendFile(fileId, { root: 'postImages'});
  }
}
