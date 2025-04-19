
import { Award, DollarSign } from 'lucide-react';
import { Movie } from '@/types/movie.types';

interface MovieDetailsProps {
  movie: Movie;
}

const MovieDetails = ({ movie }: MovieDetailsProps) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {movie.director && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">Director</h3>
          <p>{movie.director}</p>
        </div>
      )}
      {movie.writer && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">Writer</h3>
          <p>{movie.writer}</p>
        </div>
      )}
      {movie.actors && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">Cast</h3>
          <p>{movie.actors}</p>
        </div>
      )}
      {movie.awards && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">Awards</h3>
          <div className="flex items-start">
            <Award size={16} className="text-yellow-400 mr-2 mt-1" />
            <p>{movie.awards}</p>
          </div>
        </div>
      )}
      {movie.boxOffice && movie.boxOffice !== 'N/A' && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">Box Office</h3>
          <div className="flex items-center">
            <DollarSign size={16} className="text-green-500 mr-2" />
            <p>{movie.boxOffice}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
