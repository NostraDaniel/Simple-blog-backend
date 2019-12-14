import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { PostEntity } from "./post";

@Entity('image')
export class ImageEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  src: string;

  @ManyToOne(type => PostEntity, post => post.gallery )
  post: Promise<PostEntity>

  @CreateDateColumn()
  createdOn: Date;
}