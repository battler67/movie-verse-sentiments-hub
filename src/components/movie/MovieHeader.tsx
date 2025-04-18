
import { Film, Star, Calendar, Clock } from 'lucide-react';
import { Movie } from '@/services/movieService';

interface MovieHeaderProps {
  movie: Movie;
}

const MovieHeader = ({ movie }: MovieHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row gap-8">
      <div className="w-full md:w-1/4 lg:w-1/5">
        <div className="rounded-lg overflow-hidden border-2 border-white/10 shadow-xl aspect-[2/3]">
          {movie.posterPath && movie.posterPath !== 'https://placeholder.svg' ? (
            <img 
              src={movie.posterPath} 
              alt={movie.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-movie-dark">
              <Film size={64} className="text-white/20" />
            </div>
          )}
        </div>
      </div>
      
      <div className="w-full md:w-3/4 lg:w-4/5">
        <h1 className="text-2xl md:text-4xl font-bold">{movie.title}</h1>
        
        <div className="flex flex-wrap items-center gap-4 mt-4">
          {movie.imdbRating && (
            <div className="flex items-center space-x-1">
              <Star size={18} className="text-yellow-400" />
              <span className="font-medium">{movie.imdbRating}</span>
            </div>
          )}
          <div className="flex items-center space-x-1 text-white/60">
            <Calendar size={16} />
            <span>{movie.year}</span>
          </div>
          {movie.runtime && (
            <div className="flex items-center space-x-1 text-white/60">
              <Clock size={16} />
              <span>{movie.runtime}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 mt-4">
          {movie.genres && movie.genres.map((genre) => (
            <span 
              key={genre} 
              className="px-3 py-1 text-xs font-medium rounded-full bg-movie-primary/20 text-movie-primary"
            >
              {genre}
            </span>
          ))}
        </div>
        
        <p className="mt-6 text-white/80 leading-relaxed">{movie.plot}</p>
      </div>
    </div>
  );
};

export default MovieHeader;
