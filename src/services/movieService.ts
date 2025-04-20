
import { toast } from "sonner";
import { TMDB_API_URL, TMDB_API_READ_TOKEN } from '@/constants/movieData';
import { Movie } from '@/types/movie.types';
import { movieCache } from '@/utils/movieCache';

export const fetchMovieById = async (id: string): Promise<Movie | null> => {
  const cachedMovie = movieCache.getCachedMovie(id);
  if (cachedMovie) {
    return cachedMovie;
  }

  try {
    console.log(`Fetching movie details for ID: ${id}`);
    const response = await fetch(`${TMDB_API_URL}/movie/${id}?append_to_response=credits,videos`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_READ_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`TMDB API error: ${response.status} - ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched movie data for ${data.title}`);
    
    if (data.id) {
      const director = data.credits?.crew?.find((person: any) => person.job === 'Director')?.name || '';
      const writers = data.credits?.crew
        ?.filter((person: any) => ['Writer', 'Screenplay'].includes(person.job))
        ?.map((person: any) => person.name)
        ?.join(', ') || '';
      
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
        awards: '',
        runtime: data.runtime ? `${data.runtime} min` : undefined,
        boxOffice: data.revenue ? `$${data.revenue.toLocaleString()}` : '',
        imdbRating: data.vote_average.toFixed(1),
        
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
        status: data.status,
        
        videos: data.videos?.results || []
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
    console.log(`Searching movies with query: "${query}"`);
    const response = await fetch(
      `${TMDB_API_URL}/search/movie?query=${encodeURIComponent(query)}&include_adult=false`, 
      {
        headers: {
          'Authorization': `Bearer ${TMDB_API_READ_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      console.error(`TMDB Search API error: ${response.status} - ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Search results: ${data.results ? data.results.length : 0} movies found`);
    
    if (data.results) {
      return data.results.slice(0, 10).map((result: any) => ({
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
        voteCount: result.vote_count,
        adult: result.adult,
        popularity: result.popularity,
        genres: result.genre_ids || []
      }));
    }
    return [];
  } catch (error) {
    console.error('Error searching movies:', error);
    toast.error('Failed to search movies');
    return [];
  }
};

export const searchMoviesByGenre = async (genreId: string): Promise<Movie[]> => {
  try {
    console.log(`Searching movies by genre ID: ${genreId}`);
    const response = await fetch(`${TMDB_API_URL}/discover/movie?with_genres=${genreId}`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_READ_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      console.error(`TMDB Genre API error: ${response.status} - ${response.statusText}`);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Genre search results: ${data.results ? data.results.length : 0} movies found`);
    
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
