
import React from 'react';
import { Link } from 'react-router-dom';
import { Search, User, Film, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-movie-darker/80 backdrop-blur-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Film size={24} className="text-movie-primary" />
              <div className="flex flex-col">
                <span className="text-xl font-bold bg-gradient-to-r from-movie-primary to-movie-secondary bg-clip-text text-transparent">
                  Moodies
                </span>
                <span className="text-xs text-white/60 italic">bcuz every review has a vibe</span>
              </div>
            </Link>
          </div>
          
          <div className="hidden md:flex flex-1 items-center justify-center px-6">
            <div className="relative w-full max-w-lg">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search movies..." 
                className="w-full pl-10 bg-movie-dark border-white/10"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/about">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                <Info size={16} className="mr-1" />
                About
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                Sign In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-movie-primary hover:bg-movie-primary/90">
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
        
        <div className="md:hidden py-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search movies..." 
              className="w-full pl-10 bg-movie-dark border-white/10"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
