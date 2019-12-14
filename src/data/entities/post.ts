import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { User } from "./user";
import { ImageEntity } from "./image";

@Entity('posts')
export class PostEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: false })
  isPublished: boolean;

  @Column('nvarchar')
  title: string;

  @Column({ type: 'nvarchar', length: 3000})
  content: string;

  @Column({ type: 'nvarchar', length: 1000})
  description: string;

  @Column({ default: false })
  isFrontPage: boolean;

  @OneToOne(type => ImageEntity, image => image.post)
  frontImage: Promise<ImageEntity>;

  @OneToMany(type => ImageEntity, image => image.post)
  gallery: Promise<ImageEntity[]>

  @ManyToOne(type => User, user => user.posts)
  author: Promise<User>;
  
  @CreateDateColumn()
  createdOn: Date;
}