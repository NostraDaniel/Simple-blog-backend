import { IsString, IsEmail } from 'class-validator';

export class ShowUserDTO {
    @IsString()
    id: string;
    @IsString()
    name: string;
}