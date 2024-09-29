import { IsNotEmpty, IsOptional } from 'class-validator';


export class CreateMovieDto {
    

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    releaseDate: Date;

    @IsOptional()
    averageRating: Number;

   
}