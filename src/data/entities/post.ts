import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, OneToOne, JoinColumn } from "typeorm";
import { User } from "./user";
import { FrontImageEntity } from "./front-image";
import { GalleryImageEntity } from "./gallery-image";

@Entity('posts')
export class PostEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column('nvarchar')
  title: string;

  @Column({ type: 'nvarchar', length: 10000})
  content: string;

  @Column({ type: 'nvarchar', length: 1000})
  description: string;

  @Column({ default: false })
  isFrontPage: boolean;

  @OneToOne(type => FrontImageEntity, {cascade: true})
  @JoinColumn()
  frontImage: Promise<FrontImageEntity>;

  @OneToMany(type => GalleryImageEntity, image => image.post, {cascade: true})
  gallery: Promise<GalleryImageEntity[]>

  @ManyToOne(type => User, user => user.posts)
  author: Promise<User>;
  
  @CreateDateColumn()
  createdOn: Date;
}