
import { toast } from "sonner";

const OMDB_API_KEY = 'd2208170';
const OMDB_API_URL = 'http://www.omdbapi.com/';

// Sample genres for the categories
export const GENRES = [
  'Action', 'Adventure', 'Comedy', 'Drama', 'Sci-Fi', 'Horror', 'Thriller', 'Romance'
];

// Sample popular movies by IMDb ID for different genres
const GENRE_MOVIE_MAPPING = {
  'Action': ['tt0111161', 'tt0468569', 'tt0133093', 'tt0172495'],
  'Adventure': ['tt0167260', 'tt0120737', 'tt0816692', 'tt0076759'],
  'Comedy': ['tt0118799', 'tt0110912', 'tt0109830', 'tt0107290'],
  'Drama': ['tt0068646', 'tt0109830', 'tt0120338', 'tt0109830'],
  'Sci-Fi': ['tt0816692', 'tt0133093', 'tt0816692', 'tt0482571'],
  'Horror': ['tt0081505', 'tt0078748', 'tt0084787', 'tt0070047'],
  'Thriller': ['tt0114369', 'tt0102926', 'tt0110413', 'tt0167404'],
  'Romance': ['tt0338013', 'tt0120338', 'tt0211915', 'tt0211915']
};

// Interface for the movie data returned by the API
export interface OmdbMovie {
  Title: string;
  Year: string;
  Rated: string;
  Released: string;
  Runtime: string;
  Genre: string;
  Director: string;
  Writer: string;
  Actors: string;
  Plot: string;
  Language: string;
  Country: string;
  Awards: string;
  Poster: string;
  Ratings: {
    Source: string;
    Value: string;
  }[];
  Metascore: string;
  imdbRating: string;
  imdbVotes: string;
  imdbID: string;
  Type: string;
  DVD: string;
  BoxOffice: string;
  Production: string;
  Website: string;
  Response: string;
}

// Interface for our internal movie data structure
export interface Movie {
  id: string;
  title: string;
  year: string;
  posterPath: string;
  rating: number;
  genres: string[];
  director?: string;
  actors?: string;
  plot?: string;
  writer?: string;
  awards?: string;
  runtime?: string;
  boxOffice?: string;
  imdbRating?: string;
}

// Cache for movie data to reduce API calls
const movieCache = new Map<string, Movie>();
const genreMoviesCache = new Map<string, Movie[]>();

// Fetch movie by IMDb ID
export const fetchMovieById = async (id: string): Promise<Movie | null> => {
  // Check cache first
  if (movieCache.has(id)) {
    return movieCache.get(id)!;
  }

  try {
    const response = await fetch(`${OMDB_API_URL}?i=${id}&apikey=${OMDB_API_KEY}`);
    const data: OmdbMovie = await response.json();
    
    if (data.Response === 'True') {
      const movie: Movie = {
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
      };
      
      // Add to cache
      movieCache.set(id, movie);
      return movie;
    }
    return null;
  } catch (error) {
    console.error('Error fetching movie:', error);
    toast.error('Failed to fetch movie details');
    return null;
  }
};

// Search for movies by title
export const searchMovies = async (query: string): Promise<Movie[]> => {
  if (!query) return [];
  
  try {
    const response = await fetch(`${OMDB_API_URL}?s=${query}&apikey=${OMDB_API_KEY}`);
    const data = await response.json();
    
    if (data.Response === 'True') {
      // Only fetch details for the first 10 results to avoid API limits
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

// Get movies by genre
export const getMoviesByGenre = async (genre: string): Promise<Movie[]> => {
  // Check cache first
  if (genreMoviesCache.has(genre)) {
    return genreMoviesCache.get(genre)!;
  }
  
  try {
    const movieIds = GENRE_MOVIE_MAPPING[genre as keyof typeof GENRE_MOVIE_MAPPING] || [];
    const moviePromises = movieIds.map(id => fetchMovieById(id));
    const movies = await Promise.all(moviePromises);
    const filteredMovies = movies.filter((movie): movie is Movie => movie !== null);
    
    // Add to cache
    genreMoviesCache.set(genre, filteredMovies);
    return filteredMovies;
  } catch (error) {
    console.error(`Error fetching ${genre} movies:`, error);
    toast.error(`Failed to fetch ${genre} movies`);
    return [];
  }
};

// Get featured movies (mix of genres)
export const getFeaturedMovies = async (): Promise<Movie[]> => {
  try {
    // Take one movie from each genre to create a diverse featured list
    const featuredMovieIds: string[] = [];
    Object.values(GENRE_MOVIE_MAPPING).forEach(ids => {
      if (ids.length > 0) {
        featuredMovieIds.push(ids[0]);
      }
    });
    
    // Limit to 8 movies maximum
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

// Get trending movies (hardcoded for now, would come from API in real app)
export const getTrendingMovies = async (): Promise<Movie[]> => {
  try {
    // Use a mix of movies from different genres for trending
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
