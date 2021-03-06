import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne } from "typeorm";
import { PostEntity } from "./post";

@Entity('frontImage')
export class FrontImageEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  filename: string;

  @Column()
  src: string;

  @CreateDateColumn()
  createdOn: Date;
}