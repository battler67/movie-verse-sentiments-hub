
import React from 'react';
import { Button } from '@/components/ui/button';

interface HeroProps {
  onExploreClick: () => void;
}

const Hero = ({ onExploreClick }: HeroProps) => {
  return (
    <section className="hero-gradient py-16 md:py-24">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-5">
          <h1 className="text-3xl md:text-5xl font-bold text-white">
            Welcome to <span className="text-movie-primary">Moodies</span>
          </h1>
          <p className="text-white/70 max-w-2xl mx-auto text-base md:text-lg">
            bcuz every review has a vibe - Discover movies, read sentiment-analyzed reviews, and find where to watch them.
          </p>
          <Button 
            className="bg-movie-primary hover:bg-movie-primary/90 mt-4 px-6 py-2 text-lg" 
            onClick={onExploreClick}
          >
            Explore Movies
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;
