import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne } from "typeorm";
import { PostEntity } from "./post";

@Entity('galleryImage')
export class GalleryImageEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  src: string;

  @ManyToOne(type => PostEntity, post => post.gallery, {
    onDelete: 'CASCADE',
  } )
  post: Promise<PostEntity>

  @CreateDateColumn()
  createdOn: Date;
}