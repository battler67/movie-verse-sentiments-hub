
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Film, Play, Star, Users, Phone } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const teamMembers = [
  { name: 'R Murali', contact: '9063097314', img: '/placeholder.svg' },
  { name: 'Yashoda', contact: '9392811632', img: '/placeholder.svg' },
  { name: 'Madhava', contact: '+91 6300 981 252', img: '/placeholder.svg' },
  { name: 'Rajesh', contact: '+91 6302 118 329', img: '/placeholder.svg' },
];

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-movie-darker to-movie-dark">
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Film size={32} className="text-movie-primary" />
          <span className="text-2xl font-bold bg-gradient-to-r from-movie-primary to-movie-secondary bg-clip-text text-transparent">
            MovieVerse
          </span>
        </div>
        
        <nav className="flex items-center space-x-4">
          <Link to="/login">
            <Button variant="ghost" className="text-white hover:text-white/90">
              Sign In
            </Button>
          </Link>
          <Link to="/signup">
            <Button variant="default" className="bg-movie-primary hover:bg-movie-primary/90">
              Sign Up
            </Button>
          </Link>
        </nav>
      </header>
      
      <main className="flex-1 container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Discover and Track Your Favorite Movies
            </h1>
            <p className="text-lg md:text-xl text-white/80">
              Join our community of movie enthusiasts. Find new films, share your opinions, 
              and keep track of what you want to watch next.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 pt-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-movie-primary hover:bg-movie-primary/90">
                  Get Started
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-white/20">
                  Already a Member? Sign In
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="relative hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-movie-primary/20 to-movie-secondary/20 rounded-lg blur-xl"></div>
            <div className="relative grid grid-cols-2 gap-4">
              {['/placeholder.svg', '/placeholder.svg', '/placeholder.svg', '/placeholder.svg'].map((img, i) => (
                <div 
                  key={i} 
                  className="aspect-[2/3] rounded-lg overflow-hidden shadow-lg transform rotate-0 hover:rotate-2 transition-transform"
                  style={{ 
                    animationDelay: `${i * 0.2}s`,
                    transform: `rotate(${(i % 2 === 0 ? -1 : 1) * Math.random() * 5}deg)` 
                  }}
                >
                  <img src={img} alt="Movie poster" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-movie-dark/50 p-6 rounded-lg border border-white/10">
            <Star className="h-10 w-10 text-yellow-400 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Rate and Review</h3>
            <p className="text-white/70">
              Share your opinions with our community. Rate films and write detailed reviews to help others find their next favorite movie.
            </p>
          </div>
          
          <div className="bg-movie-dark/50 p-6 rounded-lg border border-white/10">
            <Play className="h-10 w-10 text-movie-primary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Watch Trailers</h3>
            <p className="text-white/70">
              Preview films before you watch. Access trailers, clips, and behind-the-scenes content from upcoming and classic movies.
            </p>
          </div>
          
          <div className="bg-movie-dark/50 p-6 rounded-lg border border-white/10">
            <Users className="h-10 w-10 text-movie-secondary mb-4" />
            <h3 className="text-xl font-semibold mb-2">Join the Community</h3>
            <p className="text-white/70">
              Connect with fellow film buffs. Discuss theories, share recommendations, and discover hidden cinematic gems.
            </p>
          </div>
        </div>
        
        <div className="mt-24">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Team</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card key={index} className="bg-movie-dark/70 border-white/10">
                <CardContent className="p-6 text-center">
                  <div className="w-24 h-24 rounded-full bg-movie-primary/20 mx-auto mb-4 overflow-hidden">
                    <img 
                      src={member.img} 
                      alt={member.name} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-xl font-medium mb-1">{member.name}</h3>
                  <div className="flex items-center justify-center text-white/70 space-x-1">
                    <Phone size={14} />
                    <span>{member.contact}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto px-4 py-8 text-center text-white/60 text-sm">
        <p>© {new Date().getFullYear()} MovieVerse. All rights reserved.</p>
        <p className="mt-2">This product uses the TMDB API but is not endorsed or certified by TMDB.</p>
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
      </footer>
    </div>
  );
};

export default LandingPage;
