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
import { UpdatePostDTO } from '../models/post/update-post-dto';
import * as fs from 'fs';

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
  
  // GET Shows all posts
  public async getAllPosts(page: number = 1, postsPerPage: number = 12, filter: string = ''): Promise<{postsCount: number, posts: PostEntity[]}> {
    const allPosts: [PostEntity[], number] = filter.trim().length > 0 ? 
      await this.postsRepository.findAndCount({
        where: {
          title: filter,
        },
        relations: ['frontImage', 'gallery'],
        take: postsPerPage,
        skip: postsPerPage * (page - 1),
        order: {
          createdOn: "DESC"
        },
      }) :
      await this.postsRepository.findAndCount({
        take: postsPerPage,
        skip: postsPerPage * (page - 1),
        relations: ['frontImage', 'gallery'],
        order: {
          createdOn: "DESC"
        },
      });

    return {postsCount: allPosts[1], posts: allPosts[0]};
  }

  // GET Show a single post by :id
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

  // GET Show posts for the front page
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

  // GET Show newest posts
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
  
  // POST Create a post
  public async createNewPost(body: NewPostDTO, author: User): Promise<PostEntity> {
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

  // POST Save an image for the front of the post
  public async uploadImage(file: any): Promise<UploadedFileImageDTO> {
    if(!file) {
      throw new NoFileException('No file available!');
    }
    
    const src = `${this.SERVER_URL}posts/${file.path}`;
    const { filename } = file;

    return await { src, filename }
  }

  // POST Save images for gallery
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

  // PUT Update an existing post
  public async updatePost(id, body: Partial<UpdatePostDTO>, user: User): Promise<PostEntity> {
    const foundPost = await this.getSinglePost(id);
    const { title, isPublished, content, description, isFrontPage, deletedFrontImage, deletedGalleryImages, gallery, frontImage } = body;

    if(!!title) {
      foundPost.title = title;
    }

    if(!!content) {
      foundPost.content = content;
    }

    if(!!description) {
      foundPost.description = description;
    }

    if(!!isPublished) {
      foundPost.isPublished = !!isPublished;
    }

    if(!!isFrontPage) {
      foundPost.isFrontPage = !! isFrontPage
    }

    if(!!gallery && gallery.length > 0) {
      const arrGallery = gallery.map(image => {
        if(image.hasOwnProperty('id')) {
          return image;
        }

        const newImg =  new GalleryImageEntity();
  
        newImg.filename = image.filename;
        newImg.src = image.src;
  
        return newImg;
      });
  
      foundPost.gallery = Promise.resolve(arrGallery);
    }
    
    if(!!frontImage && Object.keys(frontImage).length > 0 && !frontImage.hasOwnProperty('id')) {
      const newFrontImage = new FrontImageEntity();
  
      newFrontImage.src = frontImage.src;
      newFrontImage.filename = frontImage.filename;
  
      foundPost.frontImage = Promise.resolve(newFrontImage);
    }

    if(!frontImage || Object.keys(frontImage).length === 0) {
      foundPost.frontImage = null;
    }

    const saved = await this.postsRepository.save(foundPost);

    // Deleting images form the db and also from the server 
    if(!!deletedFrontImage && deletedFrontImage.hasOwnProperty('id')) {
      await this.frontImageRepository.remove(deletedFrontImage);

      this.deleteImageFile(deletedFrontImage);
    }

    if(!!deletedGalleryImages && deletedGalleryImages.length > 0) {
      await this.galleryImageRepository.remove(deletedGalleryImages);

      deletedGalleryImages.forEach(image => {
        this.deleteImageFile(image);
      });
    }

    return saved;
  }

  // DELETE an existing post
  public async deletePost(id: string, user: User): Promise<PostEntity> {
    const foundPost = await this.getSinglePost(id);
    await this.postsRepository.remove(foundPost);

    // Deleting front image file
    this.deleteImageFile(foundPost['__frontImage__']);

    // Deleting gallery img files
    for (const image of foundPost['__gallery__']) {
      this.deleteImageFile(image);
    }

    return foundPost;
  }

  // Delete image file on the server
  private deleteImageFile(file): void {
    fs.unlink(`./postImages/${file.filename}`, (err) => {
      if(err) {
        console.error(err);
        return;
      }
    });
  }
}  
