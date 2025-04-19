
import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Film, Trash2 } from 'lucide-react';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { Button } from '@/components/ui/button';

const Watchlist = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Watchlist</h1>
        
        {watchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Film size={64} className="text-white/20 mb-4" />
            <h2 className="text-xl font-medium mb-2">Your watchlist is empty</h2>
            <p className="text-white/60 mb-6">Start adding movies to your watchlist to keep track of what you want to watch</p>
            <Link to="/">
              <Button>Browse Movies</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {watchlist.map(movie => (
              <div key={movie.id} className="relative group">
                <Link to={`/movie/${movie.id}`} className="block">
                  <div className="rounded-lg overflow-hidden border border-white/5 shadow-md aspect-[2/3]">
                    {movie.posterPath ? (
                      <img 
                        src={movie.posterPath} 
                        alt={movie.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-movie-dark flex items-center justify-center">
                        <Film size={32} className="text-white/20" />
                      </div>
                    )}
                  </div>
                  <h3 className="mt-2 font-medium line-clamp-1">{movie.title}</h3>
                </Link>
                <button
                  className="absolute top-2 right-2 bg-black/70 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeFromWatchlist(movie.id)}
                  title="Remove from watchlist"
                >
                  <Trash2 size={16} className="text-red-400" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Watchlist;
