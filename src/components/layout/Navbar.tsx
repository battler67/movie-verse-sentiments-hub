
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Film, Info, Bookmark, User, LogOut } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { searchMovies } from '@/services/movieService';
import { Movie } from '@/types/movie.types';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

const Navbar = () => {
  const { watchlist } = useWatchlist();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const searchDebounce = setTimeout(async () => {
      if (searchQuery.trim().length > 1) {
        setIsSearching(true);
        const results = await searchMovies(searchQuery);
        setSearchResults(results);
        setIsSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [searchQuery]);

  const handleSearchSelect = (movieId: string) => {
    setSearchOpen(false);
    setSearchQuery('');
    navigate(`/movie/${movieId}`);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="bg-movie-darker border-b border-white/5 sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
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
            <Button
              variant="outline"
              className="relative w-full max-w-lg justify-start text-sm text-muted-foreground border-white/10 bg-movie-dark"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Search movies...</span>
              <kbd className="ml-auto pointer-events-none hidden h-5 select-none items-center gap-1 rounded border border-white/10 bg-black px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                <span className="text-xs">⌘</span>K
              </kbd>
            </Button>
            
            <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
              <CommandInput 
                placeholder="Search movies..." 
                value={searchQuery}
                onValueChange={setSearchQuery}
              />
              <CommandList>
                {isSearching ? (
                  <div className="py-6 text-center text-sm">Searching...</div>
                ) : (
                  <>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup heading="Movies">
                      {searchResults.map((movie) => (
                        <CommandItem 
                          key={movie.id} 
                          onSelect={() => handleSearchSelect(movie.id)}
                          className="cursor-pointer"
                        >
                          <div className="flex items-center space-x-2">
                            {movie.posterPath && movie.posterPath !== 'https://placeholder.svg' ? (
                              <img 
                                src={movie.posterPath} 
                                alt={movie.title} 
                                className="w-8 h-12 object-cover rounded"
                              />
                            ) : (
                              <div className="w-8 h-12 bg-white/10 rounded flex items-center justify-center">
                                <Film size={16} className="text-white/40" />
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="font-medium">{movie.title}</span>
                              <span className="text-xs text-white/60">{movie.year}</span>
                            </div>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </CommandDialog>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/about">
              <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                <Info size={16} className="mr-1" />
                About
              </Button>
            </Link>
            
            {user ? (
              <>
                <Link 
                  to="/watchlist"
                  className="relative p-2 text-white/70 hover:text-white focus:outline-none"
                >
                  <Bookmark size={20} />
                  {watchlist.length > 0 && (
                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-movie-primary rounded-full">
                      {watchlist.length}
                    </span>
                  )}
                </Link>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="focus:outline-none">
                      <Avatar className="h-8 w-8 border border-white/10">
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-movie-primary/20 text-movie-primary">
                          {user.email?.[0].toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 bg-movie-dark border-white/10">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/watchlist')}>
                      <Bookmark className="mr-2 h-4 w-4" />
                      <span>Watchlist</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/10" />
                    <DropdownMenuItem className="cursor-pointer text-red-500" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/login">
                <Button variant="ghost" size="sm" className="text-white/80 hover:text-white">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
        
        <div className="md:hidden py-2">
          <Button
            variant="outline"
            className="relative w-full justify-start text-sm text-muted-foreground border-white/10 bg-movie-dark"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search movies...</span>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
