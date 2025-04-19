
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MovieHeader from '@/components/movie/MovieHeader';
import MovieDetails from '@/components/movie/MovieDetails';
import ReviewSection from '@/components/movie/ReviewSection';
import StreamingLinks from '@/components/movie/StreamingLinks';
import SimilarMovies from '@/components/movie/SimilarMovies';
import { fetchMovieById } from '@/services/movieService';
import { fetchMovieVideos, getOfficialTrailer, TmdbVideo } from '@/services/tmdbService';
import { Movie } from '@/types/movie.types';
import { useToast } from '@/hooks/use-toast';

const STREAMING_PROVIDERS = [
  {
    name: "HBO Max",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/17/HBO_Max_Logo.svg/2560px-HBO_Max_Logo.svg.png",
    url: "https://www.hbomax.com/",
  },
  {
    name: "Amazon Prime",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f1/Prime_Video.png/800px-Prime_Video.png",
    url: "https://www.amazon.com/prime",
  },
  {
    name: "Apple TV+",
    logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Apple_TV_Plus_logo.svg/1024px-Apple_TV_Plus_logo.svg.png",
    url: "https://www.apple.com/apple-tv-plus/",
  },
];

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [trailer, setTrailer] = useState<TmdbVideo | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const loadMovie = async () => {
      try {
        if (id) {
          setLoading(true);
          
          // Fetch movie details
          const movieData = await fetchMovieById(id);
          setMovie(movieData);
          
          // Fetch movie videos/trailers
          const videos = await fetchMovieVideos(id);
          const officialTrailer = getOfficialTrailer(videos);
          setTrailer(officialTrailer);
        }
      } catch (error) {
        console.error('Error fetching movie:', error);
        toast({
          title: "Error",
          description: "Failed to load movie details. Please try again later.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    loadMovie();
  }, [id, toast]);

  useEffect(() => {
    // Scroll to top when movie changes
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-12 w-48 bg-white/10 rounded mb-4"></div>
            <div className="h-4 w-64 bg-white/10 rounded"></div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
            <p className="text-white/60">The movie you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Backdrop */}
        <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-movie-darker">
            <div className="w-full h-full bg-movie-dark bg-opacity-60 backdrop-blur-sm">
              {movie.posterPath && movie.posterPath !== 'https://placeholder.svg' && (
                <img 
                  src={movie.posterPath} 
                  alt={movie.title}
                  className="w-full h-full object-cover opacity-40"
                />
              )}
            </div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 -mt-32 md:-mt-40 lg:-mt-48 relative z-10">
          <MovieHeader movie={movie} trailer={trailer} />
          <MovieDetails movie={movie} />
          
          {/* Streaming Section */}
          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Where to Watch</h2>
            <StreamingLinks providers={STREAMING_PROVIDERS} />
          </div>
          
          {/* Similar Movies */}
          {id && <SimilarMovies movieId={id} />}
          
          <ReviewSection movieId={movie.id} />

          {/* TMDB Attribution */}
          <div className="mt-12 mb-6 text-center">
            <p className="text-xs text-white/40">
              This product uses the TMDB API but is not endorsed or certified by TMDB.
            </p>
            <a 
              href="https://www.themoviedb.org" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block mt-2"
            >
              <img 
                src="https://www.themoviedb.org/assets/2/v4/logos/v2/blue_short-8e7b30f73a4020692ccca9c88bafe5dcb6f8a62a4c6bc55cd9ba82bb2cd95f6c.svg" 
                alt="TMDB Logo" 
                className="h-6" 
              />
            </a>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MovieDetail;
