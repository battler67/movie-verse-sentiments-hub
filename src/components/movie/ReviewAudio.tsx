
import React, { useState } from 'react';
import { Headphones } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LanguageSelector, { LANGUAGES } from '@/components/translation/LanguageSelector';

interface ReviewAudioProps {
  text: string;
  language?: string;
}

const ReviewAudio: React.FC<ReviewAudioProps> = ({ text, language = 'en' }) => {
  const { isPlaying, speak } = useTextToSpeech();
  const [showEmptyDialog, setShowEmptyDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);

  const handleTextToSpeech = () => {
    if (!text || text.trim() === '') {
      setShowEmptyDialog(true);
      return;
    }
    
    setShowLanguageDialog(true);
  };

  const handleSpeakInLanguage = () => {
    speak(text, selectedLanguage);
    setShowLanguageDialog(false);
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

      {/* Empty review dialog */}
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

      {/* Language selection dialog */}
      <Dialog open={showLanguageDialog} onOpenChange={setShowLanguageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Select language</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-sm text-white/80">
              Choose a language to hear the review in:
            </p>
            <LanguageSelector 
              value={selectedLanguage}
              onChange={setSelectedLanguage}
            />
            <div className="flex justify-end pt-2">
              <Button 
                onClick={handleSpeakInLanguage}
                className="bg-movie-primary hover:bg-movie-primary/90"
              >
                Listen
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewAudio;
