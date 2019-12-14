import { ShowImageDTO } from "./show-image-dto";
import { User } from "../../data/entities/user";

export class ShowPostDTO {
    id: string;
    title: string;
    description: string;
    content: string;
    isPublished: boolean;
    frontImage?: Promise<ShowImageDTO>;
    gallery?: Promise<ShowImageDTO[]>;
    author: Promise<User>;
    createdOn: Date;
}