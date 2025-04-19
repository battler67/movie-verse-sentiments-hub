
import { toast } from "sonner";
import { TMDB_API_URL, TMDB_API_READ_TOKEN } from '@/constants/movieData';
import { Movie, OmdbMovie } from '@/types/movie.types';
import { movieCache } from '@/utils/movieCache';

export const fetchMovieById = async (id: string): Promise<Movie | null> => {
  const cachedMovie = movieCache.getCachedMovie(id);
  if (cachedMovie) {
    return cachedMovie;
  }

  try {
    // Use TMDB API instead of OMDB
    const response = await fetch(`${TMDB_API_URL}/movie/${id}?append_to_response=credits`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_READ_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    const data = await response.json();
    
    if (data.id) {
      // Extract director and writers from credits
      const director = data.credits?.crew?.find((person: any) => person.job === 'Director')?.name || '';
      const writers = data.credits?.crew
        ?.filter((person: any) => ['Writer', 'Screenplay'].includes(person.job))
        ?.map((person: any) => person.name)
        ?.join(', ') || '';
      
      // Extract cast
      const actors = data.credits?.cast
        ?.slice(0, 5)
        ?.map((person: any) => person.name)
        ?.join(', ') || '';

      const movie: Movie = {
        id: data.id.toString(),
        title: data.title,
        year: data.release_date ? data.release_date.split('-')[0] : '',
        posterPath: data.poster_path 
          ? `https://image.tmdb.org/t/p/w500${data.poster_path}` 
          : 'https://placeholder.svg',
        backdropPath: data.backdrop_path 
          ? `https://image.tmdb.org/t/p/original${data.backdrop_path}` 
          : undefined,
        rating: data.vote_average / 2,
        genres: data.genres ? data.genres.map((g: { name: string }) => g.name) : [],
        director,
        actors,
        plot: data.overview,
        writer: writers,
        awards: '', // TMDB doesn't provide awards
        runtime: data.runtime ? `${data.runtime} min` : undefined,
        boxOffice: '', // TMDB doesn't provide box office
        imdbRating: data.vote_average.toFixed(1),
        
        // Additional TMDB fields
        adult: data.adult,
        budget: data.budget,
        imdbId: data.imdb_id,
        overview: data.overview,
        productionCompanies: data.production_companies,
        releaseDate: data.release_date,
        revenue: data.revenue,
        spokenLanguages: data.spoken_languages,
        voteCount: data.vote_count,
        tagline: data.tagline,
        status: data.status
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
        imdbRating: result.vote_average.toFixed(1),
        overview: result.overview,
        backdropPath: result.backdrop_path 
          ? `https://image.tmdb.org/t/p/original${result.backdrop_path}` 
          : undefined,
        releaseDate: result.release_date,
        voteCount: result.vote_count
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

// New function to search movies by genre
export const searchMoviesByGenre = async (genreId: string): Promise<Movie[]> => {
  try {
    const response = await fetch(`${TMDB_API_URL}/discover/movie?with_genres=${genreId}`, {
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
        imdbRating: result.vote_average.toFixed(1),
        overview: result.overview,
        backdropPath: result.backdrop_path 
          ? `https://image.tmdb.org/t/p/original${result.backdrop_path}` 
          : undefined,
        releaseDate: result.release_date,
        voteCount: result.vote_count
      }));
      
      return movies;
    }
    return [];
  } catch (error) {
    console.error('Error searching movies by genre:', error);
    toast.error('Failed to search movies by genre');
    return [];
  }
};
