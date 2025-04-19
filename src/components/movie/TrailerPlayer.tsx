
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import { TmdbVideo } from '@/services/tmdbService';

interface TrailerPlayerProps {
  trailer: TmdbVideo | null;
  movieTitle: string;
}

const TrailerPlayer = ({ trailer, movieTitle }: TrailerPlayerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!trailer) {
    return null;
  }

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="border-white/10 hover:bg-white/5"
        onClick={() => setIsOpen(true)}
      >
        <Play size={18} className="text-red-500 mr-2" />
        Watch Trailer
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-xl">{movieTitle} - Trailer</DialogTitle>
          </DialogHeader>
          <div className="aspect-video w-full mt-2">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title={`${movieTitle} Trailer`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TrailerPlayer;
