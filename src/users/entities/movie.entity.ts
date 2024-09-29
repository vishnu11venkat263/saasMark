
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';


@Entity('movies')
export class Movie {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255, unique: true })
    movieName: string;

    @Column()
    releaseDate: Date;

    @Column({ default: 0 })
    averageRating: Number;
    

  
   

}