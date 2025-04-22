
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import MovieCard from './MovieCard';
import { Clock } from 'lucide-react';
import { fetchRecentMovies } from '@/services/recentMoviesService';
import { Button } from '../ui/button';

const LatestReleases = () => {
  const { data: movies = [], isLoading } = useQuery({
    queryKey: ['latestMovies'],
    queryFn: () => fetchRecentMovies(4),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="aspect-[2/3] bg-white/5 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Clock className="text-movie-primary mr-2" size={20} />
            <h2 className="text-xl font-bold">Latest Releases</h2>
          </div>
          <Button variant="link" className="text-movie-primary">
            View All
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

export default LatestReleases;
