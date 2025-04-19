
import { toast } from "sonner";
import { TMDB_API_URL, TMDB_API_READ_TOKEN } from '@/constants/movieData';
import { Movie, OmdbMovie } from '@/types/movie.types';
import { movieCache } from '@/utils/movieCache';

// This file no longer uses OMDB API, so we'll remove that transformation
export const fetchMovieById = async (id: string): Promise<Movie | null> => {
  const cachedMovie = movieCache.getCachedMovie(id);
  if (cachedMovie) {
    return cachedMovie;
  }

  try {
    // Use TMDB API instead of OMDB
    const response = await fetch(`${TMDB_API_URL}/movie/${id}`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_READ_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    
    if (data.id) {
      const movie: Movie = {
        id: data.id.toString(),
        title: data.title,
        year: data.release_date ? data.release_date.split('-')[0] : '',
        posterPath: data.poster_path 
          ? `https://image.tmdb.org/t/p/w500${data.poster_path}` 
          : 'https://placeholder.svg',
        rating: data.vote_average / 2,
        genres: data.genres ? data.genres.map((g: { name: string }) => g.name) : [],
        director: '', // We'll need to fetch credits separately
        actors: '', // We'll need to fetch credits separately
        plot: data.overview,
        writer: '', // We'll need to fetch credits separately
        awards: '', // TMDB doesn't provide awards
        runtime: `${data.runtime} min`,
        boxOffice: '', // TMDB doesn't provide box office
        imdbRating: data.vote_average.toFixed(1)
      };
      
      movieCache.setCachedMovie(id, movie);
      return movie;
    }
    return null;
  } catch (error) {
    console.error('Error fetching movie:', error);
    toast.error('Failed to fetch movie details');
    return null;
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  
  try {
    const response = await fetch(`${TMDB_API_URL}/search/movie?query=${encodeURIComponent(query)}`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_READ_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    
    if (data.results) {
      const movies = data.results.slice(0, 10).map((result: any) => ({
        id: result.id.toString(),
        title: result.title,
        year: result.release_date ? result.release_date.split('-')[0] : '',
        posterPath: result.poster_path 
          ? `https://image.tmdb.org/t/p/w500${result.poster_path}` 
          : 'https://placeholder.svg',
        rating: result.vote_average / 2,
        imdbRating: result.vote_average.toFixed(1)
      }));
      
      return movies;
    }
    return [];
  } catch (error) {
    console.error('Error searching movies:', error);
    toast.error('Failed to search movies');
    return [];
  }
};

