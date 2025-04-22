
import React from 'react';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MovieCard from '../movie/MovieCard';
import type { Movie } from '@/types/movie.types';

interface TrendingMoviesProps {
  movies: Movie[];
}

const TrendingMovies = ({ movies }: TrendingMoviesProps) => {
  return (
    <section className="py-16 bg-movie-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <TrendingUp className="text-movie-primary mr-2" size={20} />
            <h2 className="text-xl font-bold">Trending Now</h2>
          </div>
          <Button variant="link" className="text-movie-primary">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              id={parseInt(movie.id)}
              title={movie.title}
              posterPath={movie.posterPath}
              year={movie.year}
              rating={movie.rating}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingMovies;
