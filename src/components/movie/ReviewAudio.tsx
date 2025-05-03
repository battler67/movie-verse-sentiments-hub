
import React from 'react';
import { Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface ReviewAudioProps {
  text: string;
  language?: string;
}

const ReviewAudio: React.FC<ReviewAudioProps> = ({ text, language = 'en' }) => {
  const { isPlaying, speak } = useTextToSpeech();
  const [showEmptyDialog, setShowEmptyDialog] = React.useState(false);

  const handleTextToSpeech = () => {
    if (!text || text.trim() === '') {
      setShowEmptyDialog(true);
      return;
    }
    
    speak(text, language);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6" 
        onClick={handleTextToSpeech}
        title="Listen to this review"
        aria-label="Listen to review"
      >
        <Headphones 
          size={14} 
          className={isPlaying ? "text-movie-primary animate-pulse" : "text-white/70"} 
        />
      </Button>

      <Dialog open={showEmptyDialog} onOpenChange={setShowEmptyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>No text to read</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-center text-white/80">
              There is no review text to read. Please speak or type something first.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewAudio;
