
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWatchlist } from '@/contexts/WatchlistContext';
import { Movie } from '@/types/movie.types';

interface WatchlistButtonProps {
  movie: Movie;
  className?: string;
}

const WatchlistButton = ({ movie, className = '' }: WatchlistButtonProps) => {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(movie.id);

  const handleWatchlistClick = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className={`border-white/10 hover:bg-white/5 ${className}`}
      onClick={handleWatchlistClick}
    >
      {inWatchlist ? (
        <>
          <BookmarkCheck size={18} className="text-movie-primary mr-2" />
          In Watchlist
        </>
      ) : (
        <>
          <Bookmark size={18} className="mr-2" />
          Add to Watchlist
        </>
      )}
    </Button>
  );
};

export default WatchlistButton;
