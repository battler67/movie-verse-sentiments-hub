
import React, { useEffect, useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { useToast } from '@/hooks/use-toast';
import type { Movie } from '@/types/movie.types';
import { getFeaturedMovies, getTrendingMovies, getMoviesByGenre, GENRES } from '@/services/movieCollectionService';
import Hero from '@/components/home/Hero';
import GenreSearch from '@/components/home/GenreSearch';
import FeaturedMovies from '@/components/home/FeaturedMovies';
import TrendingMovies from '@/components/home/TrendingMovies';
import LatestReleases from '@/components/movie/LatestReleases';
import { Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MovieCard from '@/components/movie/MovieCard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Create a client
const queryClient = new QueryClient();

const Index = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
  const [genreSearchQuery, setGenreSearchQuery] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const loadInitialMovies = async () => {
      try {
        const [featured, trending] = await Promise.all([
          getFeaturedMovies(),
          getTrendingMovies(),
        ]);
        setFeaturedMovies(featured);
        setTrendingMovies(trending);
      } catch (error) {
        console.error('Error loading initial movies:', error);
        toast({
          title: "Error",
          description: "Failed to load movies. Please try again later.",
          variant: "destructive"
        });
      }
    };

    loadInitialMovies();
  }, [toast]);

  useEffect(() => {
    if (selectedGenre) {
      const loadGenreMovies = async () => {
        const movies = await getMoviesByGenre(selectedGenre);
        setGenreMovies(movies);
      };

      loadGenreMovies();
    }
  }, [selectedGenre]);

  const handleGenreSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (genreSearchQuery.trim()) {
      const matchedGenre = GENRES.find(genre =>
        genre.toLowerCase().includes(genreSearchQuery.toLowerCase())
      );
      if (matchedGenre) {
        setSelectedGenre(matchedGenre);
      } else {
        toast({
          title: "Genre not found",
          description: "Please enter a valid genre name",
          variant: "destructive"
        });
      }
    }
  };

  const handleExploreClick = () => {
    const searchElement = document.getElementById('search-section');
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1">
          <Hero onExploreClick={handleExploreClick} />
          
          <div id="search-section">
            <GenreSearch
              selectedGenre={selectedGenre}
              genreSearchQuery={genreSearchQuery}
              onGenreSearch={handleGenreSearch}
              onGenreClick={setSelectedGenre}
              onGenreQueryChange={setGenreSearchQuery}
            />
          </div>

          {!selectedGenre && (
            <>
              <LatestReleases />
              <FeaturedMovies movies={featuredMovies} />
              <TrendingMovies movies={trendingMovies} />
            </>
          )}

          {selectedGenre && (
            <section className="py-16">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center">
                    <Film className="text-movie-primary mr-2" size={20} />
                    <h2 className="text-xl font-bold">{selectedGenre} Movies</h2>
                  </div>
                  <Button 
                    variant="link" 
                    className="text-movie-primary"
                    onClick={() => setSelectedGenre(null)}
                  >
                    View All Categories
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {genreMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      id={parseInt(movie.id)}
                      title={movie.title}
                      posterPath={movie.posterPath}
                      year={movie.year}
                      rating={movie.rating}
                    />
                  ))}
                </div>
              </div>
            </section>
          )}
        </main>
        <Footer />
      </div>
    </QueryClientProvider>
  );
};

export default Index;
