
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Movie } from '@/types/movie.types';

type WatchlistItem = {
  id: string;
  title: string;
  posterPath: string;
};

interface WatchlistContextType {
  watchlist: WatchlistItem[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: string) => void;
  isInWatchlist: (movieId: string) => boolean;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

export const WatchlistProvider = ({ children }: { children: ReactNode }) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  // Load watchlist from localStorage on initial render
  useEffect(() => {
    const savedWatchlist = localStorage.getItem('movieWatchlist');
    if (savedWatchlist) {
      try {
        setWatchlist(JSON.parse(savedWatchlist));
      } catch (error) {
        console.error('Error parsing watchlist from localStorage:', error);
        localStorage.removeItem('movieWatchlist');
      }
    }
  }, []);

  // Save watchlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('movieWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (movie: Movie) => {
    if (!isInWatchlist(movie.id)) {
      setWatchlist(prev => [...prev, {
        id: movie.id,
        title: movie.title,
        posterPath: movie.posterPath
      }]);
      toast.success(`Added "${movie.title}" to your watchlist`);
    }
  };

  const removeFromWatchlist = (movieId: string) => {
    setWatchlist(prev => {
      const updatedWatchlist = prev.filter(item => item.id !== movieId);
      const movie = prev.find(item => item.id === movieId);
      if (movie) {
        toast.success(`Removed "${movie.title}" from your watchlist`);
      }
      return updatedWatchlist;
    });
  };

  const isInWatchlist = (movieId: string) => {
    return watchlist.some(item => item.id === movieId);
  };

  return (
    <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
