
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchSimilarMovies, TmdbMovie, simplifyTmdbMovie } from '@/services/tmdbService';
import { Star } from 'lucide-react';

interface SimilarMoviesProps {
  movieId: string;
}

const SimilarMovies = ({ movieId }: SimilarMoviesProps) => {
  const [similarMovies, setSimilarMovies] = useState<TmdbMovie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSimilarMovies = async () => {
      setLoading(true);
      const movies = await fetchSimilarMovies(movieId);
      setSimilarMovies(movies);
      setLoading(false);
    };

    loadSimilarMovies();
  }, [movieId]);

  if (loading) {
    return (
      <div className="mt-12">
        <h2 className="text-xl font-bold mb-4">Similar Movies</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="animate-pulse">
              <div className="aspect-[2/3] bg-white/10 rounded-lg"></div>
              <div className="h-4 bg-white/10 rounded mt-2 w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (similarMovies.length === 0) {
    return null;
  }

  return (
    <div className="mt-12">
      <h2 className="text-xl font-bold mb-4">Similar Movies</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {similarMovies.map((movie) => (
          <Link to={`/movie/${movie.id}`} key={movie.id} className="block">
            <div className="rounded-lg overflow-hidden border border-white/5 shadow-md transition-transform hover:scale-105">
              {movie.poster_path ? (
                <img 
                  src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`} 
                  alt={movie.title} 
                  className="w-full aspect-[2/3] object-cover"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-movie-dark flex items-center justify-center">
                  <span className="text-white/40">No Image</span>
                </div>
              )}
            </div>
            <h3 className="mt-2 text-sm font-medium line-clamp-1">{movie.title}</h3>
            {movie.vote_average > 0 && (
              <div className="flex items-center mt-1">
                <Star size={14} className="text-yellow-400 mr-1" />
                <span className="text-xs text-white/60">{(movie.vote_average / 2).toFixed(1)}</span>
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SimilarMovies;
