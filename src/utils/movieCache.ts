
import { Movie } from '@/types/movie.types';

class MovieCache {
  private movieCache: Map<string, Movie>;
  private genreMoviesCache: Map<string, Movie[]>;

  constructor() {
    this.movieCache = new Map();
    this.genreMoviesCache = new Map();
  }

  getCachedMovie(id: string): Movie | undefined {
    return this.movieCache.get(id);
  }

  setCachedMovie(id: string, movie: Movie): void {
    this.movieCache.set(id, movie);
  }

  getCachedGenreMovies(genre: string): Movie[] | undefined {
    return this.genreMoviesCache.get(genre);
  }

  setCachedGenreMovies(genre: string, movies: Movie[]): void {
    this.genreMoviesCache.set(genre, movies);
  }
}

export const movieCache = new MovieCache();
