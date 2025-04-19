
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MovieCard from '@/components/movie/MovieCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Film, TrendingUp, Star, Search } from 'lucide-react';
import { getFeaturedMovies, getTrendingMovies, getMoviesByGenre, GENRES } from '@/services/movieCollectionService';
import { useToast } from '@/hooks/use-toast';
import type { Movie } from '@/types/movie.types';

const Index = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [genreMovies, setGenreMovies] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const loadInitialMovies = async () => {
      try {
        const [featured, trending] = await Promise.all([
          getFeaturedMovies(),
          getTrendingMovies()
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
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };
  
  const handleGenreClick = (genre: string) => {
    setSelectedGenre(genre);
  };
  
  const handleExploreClick = () => {
    const searchElement = document.getElementById('search-section');
    if (searchElement) {
      searchElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <section className="hero-gradient py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-5">
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                Welcome to <span className="text-movie-primary">Moodies</span>
              </h1>
              <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg">
                bcuz every review has a vibe - Discover movies, read sentiment-analyzed reviews, and find where to watch them.
              </p>
              <Button className="bg-movie-primary hover:bg-movie-primary/90 mt-4 px-6 py-2 text-lg" onClick={handleExploreClick}>
                Explore Movies
              </Button>
            </div>
          </div>
        </section>
        
        <section id="search-section" className="py-10 bg-movie-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="search" 
                    placeholder="Search for movies..." 
                    className="w-full pl-10 bg-movie-darker border-white/10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-movie-primary hover:bg-movie-primary/90">
                  Search
                </Button>
              </div>
            </form>
          </div>
        </section>
        
        <section className="py-10 bg-movie-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {GENRES.map((genre) => (
                <Button 
                  key={genre} 
                  variant={selectedGenre === genre ? "default" : "outline"} 
                  className={selectedGenre === genre 
                    ? "bg-movie-primary hover:bg-movie-primary/90" 
                    : "border-white/10 hover:border-movie-primary/50 hover:bg-movie-primary/5"}
                  onClick={() => handleGenreClick(genre)}
                >
                  <Film size={16} className="mr-2" />
                  {genre}
                </Button>
              ))}
            </div>
          </div>
        </section>
        
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
        
        {!selectedGenre && (
          <section className="py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <Star className="text-movie-primary mr-2" size={20} />
                  <h2 className="text-xl font-bold">Featured Movies</h2>
                </div>
                <Button variant="link" className="text-movie-primary">
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredMovies.map((movie) => (
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
        
        {!selectedGenre && (
          <section className="py-16 bg-movie-dark">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <TrendingUp className="text-movie-primary mr-2" size={20} />
                  <h2 className="text-xl font-bold">Trending Now</h2>
                </div>
                <Button variant="link" className="text-movie-primary">
                  View All
                </Button>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {trendingMovies.map((movie) => (
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
  );
};

export default Index;
