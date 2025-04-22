
import React from 'react';
import { Film } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GENRES } from '@/services/movieCollectionService';

interface GenreSearchProps {
  selectedGenre: string | null;
  genreSearchQuery: string;
  onGenreSearch: (e: React.FormEvent) => void;
  onGenreClick: (genre: string) => void;
  onGenreQueryChange: (value: string) => void;
}

const GenreSearch = ({
  selectedGenre,
  genreSearchQuery,
  onGenreSearch,
  onGenreClick,
  onGenreQueryChange,
}: GenreSearchProps) => {
  return (
    <section className="py-10 bg-movie-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={onGenreSearch} className="max-w-2xl mx-auto mb-6">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input 
                type="search"
                placeholder="Search for genres..."
                className="w-full pl-10 bg-movie-darker border-white/10 rounded-lg px-3 py-2 text-base md:text-sm text-white placeholder:text-muted-foreground outline-none"
                value={genreSearchQuery}
                onChange={(e) => onGenreQueryChange(e.target.value)}
              />
              <Film className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <Button type="submit" className="bg-movie-primary hover:bg-movie-primary/90">
              Find Genre
            </Button>
          </div>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          {GENRES.map((genre) => (
            <Button 
              key={genre}
              variant={selectedGenre === genre ? "default" : "outline"}
              className={selectedGenre === genre 
                ? "bg-movie-primary hover:bg-movie-primary/90" 
                : "border-white/10 hover:border-movie-primary/50 hover:bg-movie-primary/5"}
              onClick={() => onGenreClick(genre)}
            >
              <Film size={16} className="mr-2" />
              {genre}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GenreSearch;
