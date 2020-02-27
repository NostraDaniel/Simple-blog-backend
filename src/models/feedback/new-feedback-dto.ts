import { IsString,IsNotEmpty, Length, IsEmail } from "class-validator";

export class NewFeedbackDTO {
    @IsNotEmpty()
    @IsString()
    @Length(3, 100)
    name: string;

    @IsNotEmpty()
    @IsString()
    @Length(8, 100)
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    topic: string;
    
    @IsNotEmpty()
    @Length(10, 2000)
    @IsString()
    message: string;
}