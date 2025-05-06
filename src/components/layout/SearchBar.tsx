
import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Film, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
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

interface SearchBarProps {
  isMobile?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isMobile = false }) => {
  const navigate = useNavigate();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

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
        try {
          const results = await searchMovies(searchQuery);
          setSearchResults(results);
          setShowDropdown(results.length > 0);
        } catch (error) {
          console.error("Search error:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(searchDebounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        searchInputRef.current && 
        !searchInputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.length > 1) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setShowDropdown(false);
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };
  
  const handleResultClick = (movieId: string) => {
    setSearchQuery('');
    setShowDropdown(false);
    navigate(`/movie/${movieId}`);
  };

  const SearchResultItem = ({ movie }: { movie: Movie }) => (
    <div 
      key={movie.id}
      className="flex items-center p-2 hover:bg-white/5 cursor-pointer"
      onClick={() => handleResultClick(movie.id)}
    >
      {movie.posterPath && movie.posterPath !== 'https://placeholder.svg' ? (
        <img 
          src={movie.posterPath} 
          alt={movie.title} 
          className="w-10 h-15 object-cover rounded mr-3"
        />
      ) : (
        <div className="w-10 h-15 bg-white/10 rounded mr-3 flex items-center justify-center">
          <Film size={20} className="text-white/40" />
        </div>
      )}
      <div>
        <div className="font-medium text-white">{movie.title}</div>
        <div className="text-xs text-white/60">{movie.year}</div>
      </div>
    </div>
  );

  return (
    <>
      <div className={`relative ${isMobile ? 'w-full' : 'w-full max-w-lg'}`}>
        <Input
          ref={searchInputRef}
          className="w-full pl-10 pr-10 bg-movie-dark border-white/10"
          placeholder="Search movies..."
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/60" />
        {searchQuery && (
          <button 
            className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/60 hover:text-white"
            onClick={clearSearch}
          >
            <X size={16} />
          </button>
        )}
        
        {showDropdown && (
          <div 
            ref={dropdownRef} 
            className="absolute top-full left-0 w-full mt-1 bg-movie-dark border border-white/10 rounded-md shadow-lg z-50 max-h-[300px] overflow-y-auto"
          >
            {isSearching ? (
              <div className="p-4 text-center text-white/60">Searching...</div>
            ) : searchResults.length === 0 ? (
              <div className="p-4 text-center text-white/60">No results found</div>
            ) : (
              <div className="py-2">
                {searchResults.map((movie) => (
                  <SearchResultItem key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      
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
                    onSelect={() => handleResultClick(movie.id)}
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
    </>
  );
};

export default SearchBar;
