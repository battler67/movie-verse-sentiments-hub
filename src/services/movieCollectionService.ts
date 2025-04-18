
import { toast } from "sonner";
import { Movie } from '@/types/movie.types';
import { GENRE_MOVIE_MAPPING } from '@/constants/movieData';
import { movieCache } from '@/utils/movieCache';
import { fetchMovieById } from './movieService';

export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  const cachedMovies = movieCache.getCachedGenreMovies(genre);
  if (cachedMovies) {
    return cachedMovies;
  }
  
  try {
    const movieIds = GENRE_MOVIE_MAPPING[genre as keyof typeof GENRE_MOVIE_MAPPING] || [];
    const moviePromises = movieIds.map(id => fetchMovieById(id));
    const movies = await Promise.all(moviePromises);
    const filteredMovies = movies.filter((movie): movie is Movie => movie !== null);
    
    movieCache.setCachedGenreMovies(genre, filteredMovies);
    return filteredMovies;
  } catch (error) {
    console.error(`Error fetching ${genre} movies:`, error);
    toast.error(`Failed to fetch ${genre} movies`);
    return [];
  }
};

export const getFeaturedMovies = async (): Promise<Movie[]> => {
  try {
    const featuredMovieIds: string[] = [];
    Object.values(GENRE_MOVIE_MAPPING).forEach(ids => {
      if (ids.length > 0) {
        featuredMovieIds.push(ids[0]);
      }
    });
    
    const limitedIds = [...new Set(featuredMovieIds)].slice(0, 8);
    const moviePromises = limitedIds.map(id => fetchMovieById(id));
    const movies = await Promise.all(moviePromises);
    return movies.filter((movie): movie is Movie => movie !== null);
  } catch (error) {
    console.error('Error fetching featured movies:', error);
    toast.error('Failed to fetch featured movies');
    return [];
  }
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
  try {
    const trendingMovieIds = [
      'tt3896198', // Guardians of the Galaxy Vol. 2
      'tt0468569', // The Dark Knight
      'tt0816692', // Interstellar
      'tt0110912', // Pulp Fiction
      'tt0120338', // Titanic
      'tt0133093', // The Matrix
      'tt0167260', // The Lord of the Rings: The Return of the King
      'tt0109830'  // Forrest Gump
    ];
    
    const moviePromises = trendingMovieIds.map(id => fetchMovieById(id));
    const movies = await Promise.all(moviePromises);
    return movies.filter((movie): movie is Movie => movie !== null);
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    toast.error('Failed to fetch trending movies');
    return [];
  }
};
