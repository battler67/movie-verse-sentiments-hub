
import { Award, DollarSign, Calendar, Clock, Globe, ThumbsUp, TrendingUp, Coins, Info, Tag } from 'lucide-react';
import { Movie } from '@/types/movie.types';
import { formatCurrency } from '@/utils/formatters';

interface MovieDetailsProps {
  movie: Movie;
}

const MovieDetails = ({ movie }: MovieDetailsProps) => {
  return (
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {movie.tagline && (
        <div className="col-span-1 md:col-span-2">
          <p className="text-lg italic text-white/70">"{movie.tagline}"</p>
        </div>
      )}
      
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
      
      {movie.runtime && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">Runtime</h3>
          <div className="flex items-center">
            <Clock size={16} className="text-white/60 mr-2" />
            <p>{movie.runtime}</p>
          </div>
        </div>
      )}
      
      {movie.releaseDate && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">Release Date</h3>
          <div className="flex items-center">
            <Calendar size={16} className="text-white/60 mr-2" />
            <p>{new Date(movie.releaseDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
          </div>
        </div>
      )}
      
      {movie.budget && movie.budget > 0 && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">Budget</h3>
          <div className="flex items-center">
            <Coins size={16} className="text-white/60 mr-2" />
            <p>{formatCurrency(movie.budget)}</p>
          </div>
        </div>
      )}
      
      {movie.revenue && movie.revenue > 0 && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">Revenue</h3>
          <div className="flex items-center">
            <TrendingUp size={16} className="text-green-500 mr-2" />
            <p>{formatCurrency(movie.revenue)}</p>
          </div>
        </div>
      )}
      
      {movie.spokenLanguages && movie.spokenLanguages.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">Languages</h3>
          <div className="flex items-center flex-wrap gap-2">
            <Globe size={16} className="text-white/60 mr-1" />
            {movie.spokenLanguages.map(lang => (
              <span key={lang.iso_639_1} className="text-sm">
                {lang.english_name}
              </span>
            )).reduce((prev, curr, i) => {
              return i === 0 ? [curr] : [...prev, ', ', curr];
            }, [] as React.ReactNode[])}
          </div>
        </div>
      )}
      
      {movie.voteCount && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">Vote Count</h3>
          <div className="flex items-center">
            <ThumbsUp size={16} className="text-white/60 mr-2" />
            <p>{movie.voteCount.toLocaleString()}</p>
          </div>
        </div>
      )}
      
      {movie.imdbId && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">IMDb</h3>
          <div className="flex items-center">
            <Info size={16} className="text-white/60 mr-2" />
            <a 
              href={`https://www.imdb.com/title/${movie.imdbId}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-movie-primary hover:underline"
            >
              View on IMDb
            </a>
          </div>
        </div>
      )}
      
      {movie.status && (
        <div>
          <h3 className="text-sm font-medium text-white/60 mb-2">Status</h3>
          <div className="flex items-center">
            <Tag size={16} className="text-white/60 mr-2" />
            <p>{movie.status}</p>
          </div>
        </div>
      )}
      
      {movie.productionCompanies && movie.productionCompanies.length > 0 && (
        <div className="col-span-1 md:col-span-2 mt-4">
          <h3 className="text-sm font-medium text-white/60 mb-3">Production Companies</h3>
          <div className="flex flex-wrap gap-6">
            {movie.productionCompanies.map(company => (
              <div key={company.id} className="flex flex-col items-center">
                {company.logo_path ? (
                  <img 
                    src={`https://image.tmdb.org/t/p/w200${company.logo_path}`} 
                    alt={company.name}
                    className="h-12 object-contain mb-2 bg-white/5 p-1 rounded"
                  />
                ) : (
                  <div className="h-12 w-24 flex items-center justify-center bg-white/5 mb-2 rounded">
                    <span className="text-xs text-white/40">No logo</span>
                  </div>
                )}
                <span className="text-xs text-center">{company.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
