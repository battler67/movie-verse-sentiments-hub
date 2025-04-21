
import { TMDB_API_URL, TMDB_API_READ_TOKEN, TMDB_IMAGE_BASE_URL } from '@/constants/movieData';
import { toast } from 'sonner';
import { Movie } from '@/types/movie.types';

export const fetchRecentMovies = async (limit = 5): Promise<Movie[]> => {
  try {
    const response = await fetch(`${TMDB_API_URL}/movie/now_playing`, {
      headers: {
        'Authorization': `Bearer ${TMDB_API_READ_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.results && Array.isArray(data.results)) {
      // Sort by release date descending to get most recent movies
      const sorted = data.results.sort((a: any, b: any) => {
        if (!a.release_date) return 1;
        if (!b.release_date) return -1;
        return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
      });
      // Take only the specified limit
      return sorted.slice(0, limit).map((movie: any) => ({
        id: movie.id.toString(),
        title: movie.title,
        year: movie.release_date ? movie.release_date.split('-')[0] : '',
        posterPath: movie.poster_path 
          ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` 
          : 'https://placeholder.svg',
        rating: movie.vote_average / 2, // Convert to 5-star scale
        imdbRating: movie.vote_average.toFixed(1),
        overview: movie.overview,
        backdropPath: movie.backdrop_path 
          ? `${TMDB_IMAGE_BASE_URL}/original${movie.backdrop_path}` 
          : undefined,
        releaseDate: movie.release_date,
        voteCount: movie.vote_count,
        genres: []
      }));
    }
    return [];
  } catch (error) {
    console.error('Error fetching recent movies:', error);
    toast.error('Failed to fetch recent movies');
    return [];
  }
};
