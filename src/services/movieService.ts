
import { toast } from "sonner";
import { OMDB_API_KEY, OMDB_API_URL, GENRE_MOVIE_MAPPING } from '@/constants/movieData';
import { Movie, OmdbMovie } from '@/types/movie.types';
import { movieCache } from '@/utils/movieCache';

export { GENRES } from '@/constants/movieData';

const transformOmdbToMovie = (data: OmdbMovie): Movie => ({
  id: data.imdbID,
  title: data.Title,
  year: data.Year,
  posterPath: data.Poster !== 'N/A' ? data.Poster : 'https://placeholder.svg',
  rating: parseFloat(data.imdbRating) || 0,
  genres: data.Genre.split(', '),
  director: data.Director,
  actors: data.Actors,
  plot: data.Plot,
  writer: data.Writer,
  awards: data.Awards,
  runtime: data.Runtime,
  boxOffice: data.BoxOffice,
  imdbRating: data.imdbRating
});

export const fetchMovieById = async (id: string): Promise<Movie | null> => {
  const cachedMovie = movieCache.getCachedMovie(id);
  if (cachedMovie) {
    return cachedMovie;
  }

  try {
    const response = await fetch(`${OMDB_API_URL}?i=${id}&apikey=${OMDB_API_KEY}`);
    const data: OmdbMovie = await response.json();
    
    if (data.Response === 'True') {
      const movie = transformOmdbToMovie(data);
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
    const response = await fetch(`${OMDB_API_URL}?s=${query}&apikey=${OMDB_API_KEY}`);
    const data = await response.json();
    
    if (data.Response === 'True') {
      const limitedResults = data.Search.slice(0, 10);
      const moviePromises = limitedResults.map((result: any) => fetchMovieById(result.imdbID));
      const movies = await Promise.all(moviePromises);
      return movies.filter((movie): movie is Movie => movie !== null);
    }
    return [];
  } catch (error) {
    console.error('Error searching movies:', error);
    toast.error('Failed to search movies');
    return [];
  }
};
