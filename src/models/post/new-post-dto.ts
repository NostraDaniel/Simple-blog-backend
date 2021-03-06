import { IsString,IsNotEmpty, Length } from "class-validator";
import { ShowImageDTO } from "./show-image-dto";

export class NewPostDTO {
    @IsNotEmpty()
    @IsString()
    @Length(5, 100)
    title: string;

    @IsNotEmpty()
    @IsString()
    @Length(15, 10000)
    content: string;

    @IsNotEmpty()
    @IsString()
    @Length(5, 1000)
    description: string;
    
    isFrontPage?: boolean;
    isPublished?: boolean;
    gallery?: any[];
    frontImage?: any;
}