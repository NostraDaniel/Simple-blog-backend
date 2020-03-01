import { IsString,IsNotEmpty, Length } from "class-validator";
import { ShowImageDTO } from "./show-image-dto";
import { FrontImageEntity } from "../../data/entities/front-image";
import { GalleryImageEntity } from "../../data/entities/gallery-image";

export class UpdatePostDTO {

    @IsString()
    @Length(5, 100)
    title: string;

    @IsString()
    @Length(15, 10000)
    content: string;

    @IsString()
    @Length(5, 1000)
    description: string;
    
    isFrontPage?: boolean;
    isPublished?: boolean;
    gallery?: any[];
    frontImage?: any;
    deletedGalleryImages?: GalleryImageEntity[];
    deletedFrontImage?: FrontImageEntity;
}