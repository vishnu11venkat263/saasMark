
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';


@Entity('reviews')
export class Review {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ })
    movieId: string;


    @Column({ length: 255})
    reviewerName: string;

    @Column({ default: 0 })
    rating: number;

    @Column({ default: null })
    reviewComments: string;
    

}