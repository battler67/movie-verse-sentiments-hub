
import { toast } from "sonner";
import { TMDB_API_URL, TMDB_API_READ_TOKEN, TMDB_IMAGE_BASE_URL } from '@/constants/movieData';

export interface TmdbMovie {
  id: number;
  title: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  overview: string;
}

export interface TmdbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
}

export const simplifyTmdbMovie = (movie: TmdbMovie) => ({
  id: movie.id.toString(),
  title: movie.title,
  year: movie.release_date ? movie.release_date.split('-')[0] : '',
  posterPath: movie.poster_path 
    ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}` 
    : 'https://placeholder.svg',
  rating: movie.vote_average / 2, // Convert to 5-star scale
  plot: movie.overview,
});

const fetchWithHeaders = (url: string) => {
  return fetch(url, {
    headers: {
      'Authorization': `Bearer ${TMDB_API_READ_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });
};

export const fetchSimilarMovies = async (movieId: string): Promise<TmdbMovie[]> => {
  try {
    const response = await fetchWithHeaders(`${TMDB_API_URL}/movie/${movieId}/similar`);
    const data = await response.json();
    
    if (data.results && Array.isArray(data.results)) {
      return data.results.slice(0, 6); // Limit to 6 similar movies
    }
    return [];
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    toast.error('Failed to fetch similar movies');
    return [];
  }
};

export const fetchMovieVideos = async (movieId: string): Promise<TmdbVideo[]> => {
  try {
    const response = await fetchWithHeaders(`${TMDB_API_URL}/movie/${movieId}/videos`);
    const data = await response.json();
    
    if (data.results && Array.isArray(data.results)) {
      return data.results;
    }
    return [];
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    toast.error('Failed to fetch movie videos');
    return [];
  }
};

export const getOfficialTrailer = (videos: TmdbVideo[]): TmdbVideo | null => {
  // First, look for an official trailer
  const officialTrailer = videos.find(video => 
    video.type === 'Trailer' && 
    video.official === true && 
    video.site === 'YouTube'
  );
  
  if (officialTrailer) return officialTrailer;
  
  // If no official trailer, look for any trailer
  const anyTrailer = videos.find(video => 
    video.type === 'Trailer' && 
    video.site === 'YouTube'
  );
  
  return anyTrailer || null;
};
