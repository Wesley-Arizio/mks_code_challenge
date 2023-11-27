import { Module } from '@nestjs/common';
import { MoviesModule } from './movies/movies.module';
import { MoviesService } from './movies/movies.service';
import { MoviesController } from './movies/movies.controller';

@Module({
  imports: [MoviesModule],
  providers: [MoviesService],
  controllers: [MoviesController],
})
export class MoviesHttpModule {}
