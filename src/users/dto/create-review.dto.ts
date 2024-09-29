import { IsNotEmpty, IsOptional } from 'class-validator';


export class CreateReviewDto {
    

    @IsNotEmpty()
    movieId: string;

    @IsOptional()
    reviewerName: string;

    @IsNotEmpty()
    rating: number;

    @IsNotEmpty()
    reviewComments: string;

   
}