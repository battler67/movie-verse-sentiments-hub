
import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import MovieCard from '@/components/movie/MovieCard';
import { Button } from '@/components/ui/button';
import { Film, TrendingUp, Star, Clock } from 'lucide-react';

// Mock data for now (would come from API in real implementation)
const FEATURED_MOVIES = [
  { id: 1, title: "Dune: Part Two", posterPath: "https://image.tmdb.org/t/p/w500/8b8R8l88Qje9dn9OE8PY05Nxl1X.jpg", year: "2024", rating: 8.5 },
  { id: 2, title: "Oppenheimer", posterPath: "https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg", year: "2023", rating: 8.4 },
  { id: 3, title: "Poor Things", posterPath: "https://image.tmdb.org/t/p/w500/kCGlIMHnOm8JPXq3rXM6c5wMxcT.jpg", year: "2023", rating: 8.0 },
  { id: 4, title: "Killers of the Flower Moon", posterPath: "https://image.tmdb.org/t/p/w500/dB6GwAk8O5HfVVCf5jmhDrcLW9v.jpg", year: "2023", rating: 7.7 },
];

const TRENDING_MOVIES = [
  { id: 5, title: "The Fall Guy", posterPath: "https://image.tmdb.org/t/p/w500/95PWURvCjfl4ioFPDhP9XyZ5Kh6.jpg", year: "2024", rating: 7.3 },
  { id: 6, title: "Challengers", posterPath: "https://image.tmdb.org/t/p/w500/waBWlJlMpyFb7STkFHfFvJKgwww.jpg", year: "2024", rating: 7.4 },
  { id: 7, title: "Civil War", posterPath: "https://image.tmdb.org/t/p/w500/A2VTrjjr8FpNHtUCLeC5I39RAgr.jpg", year: "2024", rating: 6.9 },
  { id: 8, title: "Godzilla x Kong", posterPath: "https://image.tmdb.org/t/p/w500/wLrm8Mwq33kWbylvkm0YnKCGcEw.jpg", year: "2024", rating: 7.0 },
];

const CATEGORIES = [
  { name: "Action", icon: <Film size={16} /> },
  { name: "Drama", icon: <Film size={16} /> },
  { name: "Comedy", icon: <Film size={16} /> },
  { name: "Sci-Fi", icon: <Film size={16} /> },
  { name: "Horror", icon: <Film size={16} /> },
  { name: "Thriller", icon: <Film size={16} /> },
];

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="hero-gradient py-16 md:py-24">
          <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-5">
              <h1 className="text-3xl md:text-5xl font-bold text-white">
                Discover Movies, <span className="text-movie-primary">Read Reviews</span>
              </h1>
              <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg">
                Search for your favorite movies, read community reviews with sentiment analysis, and find where to watch them.
              </p>
              <Button className="bg-movie-primary hover:bg-movie-primary/90 mt-4 px-6 py-2 text-lg">
                Explore Movies
              </Button>
            </div>
          </div>
        </section>
        
        {/* Categories Section */}
        <section className="py-10 bg-movie-dark">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {CATEGORIES.map((category) => (
                <Button 
                  key={category.name} 
                  variant="outline" 
                  className="border-white/10 hover:border-movie-primary/50 hover:bg-movie-primary/5"
                >
                  {category.icon}
                  <span className="ml-2">{category.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured Movies Section */}
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
              {FEATURED_MOVIES.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.posterPath}
                  year={movie.year}
                  rating={movie.rating}
                />
              ))}
            </div>
          </div>
        </section>
        
        {/* Trending Movies Section */}
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
              {TRENDING_MOVIES.map((movie) => (
                <MovieCard
                  key={movie.id}
                  id={movie.id}
                  title={movie.title}
                  posterPath={movie.posterPath}
                  year={movie.year}
                  rating={movie.rating}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
