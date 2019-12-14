import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '../data/entities/post';
import { NewPostDTO } from '../models/post/new-post-dto';
import { User } from '../data/entities/user';
import { PostNotFound } from '../common/exceptions/posts/post-not-found.exception';
import { ShowImageDTO } from '../models/post/show-image-dto';
import { ImageEntity } from '../data/entities/image';
import { NoFileException } from '../common/exceptions/posts/no-file.exception';
import { UploadedFileImageDTO } from '../models/post/uploaded-file-image-dto';

@Injectable()
export class PostsService {

  private SERVER_URL:  string  =  "http://localhost:4202/";

  constructor(
    @InjectRepository(PostEntity)
    private readonly postsRepository: Repository<PostEntity>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(ImageEntity)
    private readonly imageRepository: Repository<ImageEntity>,
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
        relations: ['frontImage']
      });

    return {postsCount: allPosts[1], posts: allPosts[0]};
  }

  // GET a single post by :id
  public async getSinglePost(id: string): Promise<PostEntity> {
    const foundPost = await this.postsRepository.findOne({
      where: {
        id
      },
      relations: ['gallery']
    })

    if ( !foundPost ) {
      throw new PostNotFound(`Post with this ID ${id} doesn't exist`);
    }

    return foundPost;
  }
  
  // POST a post
  public async createNewPost(body: NewPostDTO, author: User) {
    const { title, content, isPublished, description, gallery, isFrontPage, frontImage } = body;
    const newPost = this.postsRepository.create({ title, content, description, isPublished, isFrontPage});

    newPost.author = Promise.resolve(author);

    const savedPost = await this.postsRepository.save(newPost);

    if(gallery.length > 0) {
      for (const image of gallery) {
        const newImg = await this.imageRepository.create({ url: image.url, filename: image.filename, post: Promise.resolve(savedPost)});
        
        this.imageRepository.save(newImg);
      }
    }
    
    if(Object.keys(frontImage).length > 0 ) {
      const newFrontImage = this.imageRepository.create(frontImage);
      
      newFrontImage.post = Promise.resolve(savedPost);
      await this.imageRepository.save(newFrontImage);
    }

    await savedPost.gallery;
    await savedPost.frontImage;

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
    const deleted = await this.postsRepository.delete(foundPost);

    return foundPost;
  }

  // POST save an image
  public async uploadImage(file: any): Promise<UploadedFileImageDTO> {
    if(!file) {
      throw new NoFileException('No file available!');
    }
    
    const url = `${this.SERVER_URL}posts/${file.path}`;
    const { filename } = file;

    return await { url, filename }
  }

  public async uploadImages(files: any): Promise<ShowImageDTO[]> {
    if(files.lenght) {
      throw new NoFileException('No files available!');
    }

    return await files.map(file => {
      const url = `${this.SERVER_URL}posts/${file.path}`;
      const { filename } = file;

      return { url, filename };
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
