import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  VersionColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Role } from './role';
import { PostEntity } from './post';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('nvarchar')
  name: string;

  @Column('nvarchar')
  password: string;

  @Column({ unique: true })
  email: string;

  @ManyToMany(type => Role, { eager: true })
  @JoinTable()
  roles: Role[];

  @CreateDateColumn()
  createdOn: Date;

  @UpdateDateColumn()
  updatedOn: Date;

  @VersionColumn()
  version: number;

  @OneToMany(type => PostEntity, post => post.author)
  posts: Promise<PostEntity[]>;
}
