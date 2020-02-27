import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../data/entities/post';
import { NewPostDTO } from '../models/post/new-post-dto';
import { User } from '../data/entities/user';
import { PostNotFound } from '../common/exceptions/posts/post-not-found.exception';
import { ShowImageDTO } from '../models/post/show-image-dto';
import { NoFileException } from '../common/exceptions/posts/no-file.exception';
import { UploadedFileImageDTO } from '../models/post/uploaded-file-image-dto';
import { isArray } from 'util';
import { FrontImageEntity } from '../data/entities/front-image';
import { GalleryImageEntity } from '../data/entities/gallery-image';

@Injectable()
export class PostsService {

  private readonly SERVER_URL:  string  =  "http://localhost:4202/";

  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(FrontImageEntity)
    private readonly frontImageRepository: Repository<FrontImageEntity>,
    @InjectRepository(GalleryImageEntity)
    private readonly galleryImageRepository: Repository<GalleryImageEntity>,
  ) {}
  
  // GET all posts
  public async getAllPosts(page: number = 1, postsPerPage: number = 12, filter: string = ''): Promise<{postsCount: number, posts: PostEntity[]}> {
    const allPosts: [PostEntity[], number] = filter.trim().length > 0 ? 
      await this.postsRepository.findAndCount({
        where: {
          title: filter,
        },
        relations: ['frontImage'],
        take: postsPerPage,
        skip: postsPerPage * (page - 1),
        order: {
          createdOn: "DESC"
        },
      }) :
      await this.postsRepository.findAndCount({
        take: postsPerPage,
        skip: postsPerPage * (page - 1),
        relations: ['frontImage'],
        order: {
          createdOn: "DESC"
        },
      });

    return {postsCount: allPosts[1], posts: allPosts[0]};
  }

  // GET a single post by :id
  public async getSinglePost(id: string): Promise<PostEntity> {
    const foundPost = await this.postsRepository.findOne({
      where: {
        id
      },
      relations: ['frontImage', 'gallery'],
    })

    if ( !foundPost ) {
      throw new PostNotFound(`Post with this ID ${id} doesn't exist`);
    }

    return foundPost;
  }
  
  // POST a post
  public async createNewPost(body: NewPostDTO, author: User) {
    const { title, content, isPublished, description, gallery, isFrontPage, frontImage } = body;
    const newPost = new PostEntity();

    newPost.author = Promise.resolve(author);
    newPost.title = title;
    newPost.content = content;
    newPost.description = description;
    
    if(!!isFrontPage) {
      newPost.isFrontPage = isFrontPage;
    }

    if(!!isPublished) {
      newPost.isPublished = isPublished;
    }

    if(!!frontImage && Object.keys(frontImage).length > 0) {
      const newFrontImage = new FrontImageEntity();
  
      newFrontImage.src = frontImage.src;
      newFrontImage.filename = frontImage.filename;
  
      newPost.frontImage = Promise.resolve(newFrontImage);
    }
    
    if(isArray(gallery) && gallery.length > 0) {
      const arrGallery = gallery.map(image => {
        const newImg =  new GalleryImageEntity();
  
        newImg.filename = image.filename;
        newImg.src = image.src;
  
        return newImg;
      });
  
      newPost.gallery = Promise.resolve(arrGallery);
    }

    const savedPost = await this.postsRepository.save(newPost);
    
    return savedPost;
  }

  // PUT an existing post
  public async updatePost(id, body: Partial<NewPostDTO>, user: User): Promise<PostEntity> {
    const foundPost = await this.getSinglePost(id);
    const { title, isPublished, content, description } = body;

    if(!!body.title) {
      foundPost.title = title;
    }

    if(!!body.content) {
      foundPost.content = content;
    }

    if(!!body.description) {
      foundPost.description = description;
    }

    foundPost.isPublished = !!isPublished;
    
    await this.postsRepository.save(foundPost);

    return foundPost;
  }

  // DELETE an existing post
  public async deletePost(id: string, user: User): Promise<PostEntity> {
    const foundPost = await this.getSinglePost(id);
    await this.postsRepository.remove(foundPost);

    return foundPost;
  }

  // POST save an image
  public async uploadImage(file: any): Promise<UploadedFileImageDTO> {
    if(!file) {
      throw new NoFileException('No file available!');
    }
    
    const src = `${this.SERVER_URL}posts/${file.path}`;
    const { filename } = file;

    return await { src, filename }
  }

  // POST save images gallery
  public async uploadImages(files: any): Promise<ShowImageDTO[]> {
    if(files.lenght) {
      throw new NoFileException('No files available!');
    }

    return await files.map(file => {
      const src = `${this.SERVER_URL}posts/${file.path}`;
      const { filename } = file;

      return { src, filename };
    });
  }

  // Front page posts
  public async getFrontPagePosts(): Promise<PostEntity[]> {
    const posts = 
      await this.postsRepository.find({
        relations: ["frontImage"],
        where: { 
            isPublished: true,
            isFrontPage: true
        },
        order: {
          createdOn: "DESC"
        },
        take: 6,
      });

    return posts;
  }

  // Newest posts
  public async getNewestPosts(): Promise<PostEntity[]> {
    const posts = 
      await this.postsRepository.find({
        where: {
          isPublished: true
        },
        relations: ["frontImage"],
        order: {
          createdOn: "DESC"
        },
        take: 6,
      });
    
    return posts;
  }
}  
