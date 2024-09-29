import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMovieDto } from './dto/create-movie.dto';
import { CreateReviewDto } from './dto/create-review.dto';
import { Movie } from './entities/movie.entity';
import { Like, ILike } from 'typeorm';
import { Review } from './entities/review.entity';

@Injectable()
export class MovieService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async createMovie(createMovieDto: CreateMovieDto) {
    const existingMovie = await this.movieRepository.findOne({
      where: { movieName: createMovieDto.name },
    });
    if (existingMovie) {
      throw new ConflictException('Movie already exists');
    }
    const movie = new Movie();
    movie.movieName = createMovieDto.name;
    movie.releaseDate = createMovieDto.releaseDate;

    return this.movieRepository.save(movie);
  }

  async createReview(createReviewDto: CreateReviewDto) {
    const review = new Review();
    review.movieId = createReviewDto.movieId;
    review.reviewerName = createReviewDto.reviewerName;
    review.rating = createReviewDto.rating;
    review.reviewComments = createReviewDto.reviewComments;
    await this.averageRating(review.movieId ,review.rating);
    return this.reviewRepository.save(review);
  }

  async getMovieList(data) {
    if (data) {
      return await this.movieRepository.find({
        where: { movieName: ILike(`%${data}%`) },
      });
    }

    const finalOutput = await this.movieRepository.find();

    return finalOutput;
  }

  async averageRating(movieId: string ,rating : Number) {
    const reviews = await this.reviewRepository.find({
      where: { movieId },
    });

    if (reviews.length === 0) {
      return await this.movieRepository.update(movieId, {
        averageRating: rating,
      });
    }
    const totalScore = reviews.reduce((sum, review) => sum + review.rating, 0);
    console.log(totalScore);
    const reviewCount = reviews.length * 10;
    console.log(reviewCount);
    const averageRatig = Math.round((totalScore / reviewCount) * 10);
    console.log(averageRatig);
    await this.movieRepository.update(movieId, {
      averageRating: Number(averageRatig),
    });
  }

  async movieReviews(movieeId) {
    const data = await this.movieRepository.find({ where: { id: movieeId } });

    const reviewData = await this.reviewRepository.find({
      where: { movieId: movieeId },
    });

    const formattedData = {
      movie: data[0],
      reviews: reviewData,
    };
    return formattedData;
  }

  async movieEditReviews(reviewId) {
    const reviewData = await this.reviewRepository.find({
      where: { id: reviewId },
    });

    const movieName = await this.movieRepository.find({
      where: { id: reviewData[0].movieId },
    });
    const finalOutput = {
      movie: movieName[0],
      reviews: reviewData[0],
    };

    return finalOutput;
  }

  async updateReview(body, reviewId) {
    const reviewData = await this.reviewRepository.findOneBy({ id: reviewId });
    if (!reviewData) {
      return { message: 'Review not found' };
    }
    Object.assign(reviewData, body);
    const updatedData = await this.reviewRepository.save(reviewData);
    if (updatedData) {
      return { message: 'Review Updated' };
    }
    await this.averageRating(body.movieId ,Number(body.rating) );

    return { message: 'Review Not Updated' };
  }

  async updateMovie(body, movieId) {
    const movieData = await this.movieRepository.findOneBy({ id: movieId });
    if (!movieData) {
      return { message: 'Movie not found' };
    }
    Object.assign(movieData, body);
    const updatedData = await this.movieRepository.save(movieData);
    if (updatedData) {
      return { message: 'Movie Updated' };
    }

    return { message: 'Movie Not Updated' };
  }


  async deleteMovieAndReviews(movieId: string) {
   
    const deleteReviews = await this.reviewRepository.delete({movieId : movieId });
    const deleteMovie = await this.movieRepository.delete({id : movieId});

    if(deleteReviews && deleteMovie)
      {
      return { message: 'Movie and Reviews Deleted Successfully' };
    }
    return { message: 'Movie and Reviews Not Deleted' };
  }


  async deleteReviews(reviewId: string) {
   
    const deleteReviews = await this.reviewRepository.delete({id : reviewId});
    

    if(deleteReviews)
      {
      return { message: 'Reviews Deleted Successfully' };
    }
    return { message: 'Reviews Not Deleted' };
  }
}
