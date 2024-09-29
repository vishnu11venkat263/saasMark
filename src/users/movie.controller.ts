import { Controller, Get, Post, Body,Req,  UseGuards, Request, Query, Param, Delete } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieService } from './movie.service';
import { log } from 'console';
import { CreateReviewDto } from './dto/create-review.dto';



@Controller('movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
   
  ) { }

  @Post('addMovie')
  async register(@Body() createMovieDto: CreateMovieDto) {
    const movie = await this.movieService.createMovie(createMovieDto);
    
    return { status : 200 , message: 'Movie Added Successfully' };
  }

  @Post('addReview')
  async review(@Body() CreateReviewDto: CreateReviewDto) {
    const movie = await this.movieService.createReview(CreateReviewDto);
  
    return { status : 200 , message: 'Movie Review Added Successfully' };
  }
  
  @Get('')
  movieList(@Req() req ,@Query() query) {
     return this.movieService.getMovieList(query.search);
  }


  @Get('reviews/:id')
  async movieReview(@Param() params) {
  
    
    const movieReviews = await this.movieService.movieReviews(params.id);
    return movieReviews;
  }


  @Get('editReviews/:id')
  async movieEditReview(@Param() params) {
  
    
    const movieReviews = await this.movieService.movieEditReviews(params.id);
    return movieReviews;
  }

  @Post('updateReview/:id')
  async updateReview(@Body() body ,@Param() params) {
  
    
    const movieReviews = await this.movieService.updateReview(body,params.id);
    return movieReviews;
  }

  @Post('updateMovie/:id')
  async updateMovie(@Body() body ,@Param() params) {
  
    
    const movieReviews = await this.movieService.updateMovie(body,params.id);
    return movieReviews;
  }
  @Delete(':movieId')
  async deleteMovieAndReviews(@Param('movieId') movieId: string) {
    await this.movieService.deleteMovieAndReviews(movieId);
    return { message: 'Movie and its reviews deleted successfully' };
  }
  
  @Delete('reviews/:reviewId')
  async deleteReviews(@Param('reviewId') reviewId: string) {
    await this.movieService.deleteReviews(reviewId);
    return { message: 'Movie and its reviews deleted successfully' };
  }
}