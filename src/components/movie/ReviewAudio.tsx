
import React, { useState } from 'react';
import { Headphones, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LanguageSelector, { LANGUAGES } from '@/components/translation/LanguageSelector';
import { toast } from 'sonner';

interface ReviewAudioProps {
  text: string;
  language?: string;
}

const ReviewAudio: React.FC<ReviewAudioProps> = ({ text, language = 'en' }) => {
  const { isPlaying, speak, stopSpeaking, audioUrl, isGenerating } = useTextToSpeech();
  const [showEmptyDialog, setShowEmptyDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [audioGenerated, setAudioGenerated] = useState(false);

  const handleTextToSpeech = () => {
    if (!text || text.trim() === '') {
      setShowEmptyDialog(true);
      return;
    }
    
    if (isPlaying) {
      stopSpeaking();
      return;
    }
    
    setShowLanguageDialog(true);
  };

  const handleSpeakInLanguage = async () => {
    await speak(text, selectedLanguage);
    setAudioGenerated(true);
    setShowLanguageDialog(false);
  };

  const handleDownloadAudio = () => {
    if (!audioUrl) {
      toast.error("No audio generated yet");
      return;
    }

    try {
      // Create a temporary anchor element for downloading
      const downloadLink = document.createElement('a');
      downloadLink.href = audioUrl;
      
      // Find language name for the filename
      const languageName = LANGUAGES.find(lang => lang.code === selectedLanguage)?.name || 'audio';
      
      // Set the download attribute with a meaningful filename
      downloadLink.download = `review-${languageName.toLowerCase()}.mp3`;
      
      // Append to the document body
      document.body.appendChild(downloadLink);
      
      // Programmatically click the link to trigger download
      downloadLink.click();
      
      // Clean up
      document.body.removeChild(downloadLink);
      
      toast.success(`Downloading audio in ${languageName}`);
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Failed to download audio file");
    }
  };

  const checkAudioPlayability = async (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const audio = new Audio(url);
      audio.oncanplaythrough = () => resolve(true);
      audio.onerror = () => resolve(false);
      // Set a timeout in case the audio never loads
      setTimeout(() => resolve(false), 3000);
      audio.load();
    });
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-6 w-6" 
        onClick={handleTextToSpeech}
        disabled={isGenerating}
        title={isPlaying ? "Stop playback" : "Listen to this review"}
        aria-label={isPlaying ? "Stop playback" : "Listen to review"}
      >
        {isGenerating ? (
          <Loader2 size={14} className="animate-spin text-movie-primary" />
        ) : (
          <Headphones 
            size={14} 
            className={isPlaying ? "text-movie-primary animate-pulse" : "text-white/70"} 
          />
        )}
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
            <div className="flex justify-between pt-2">
              <Button
                variant="outline"
                onClick={handleDownloadAudio}
                disabled={!audioUrl || isGenerating || !audioGenerated}
                className="flex items-center gap-1"
              >
                <Download size={14} />
                Download Audio
              </Button>
              <Button 
                onClick={handleSpeakInLanguage}
                disabled={isGenerating}
                className="bg-movie-primary hover:bg-movie-primary/90"
              >
                {isGenerating ? (
                  <>
                    <Loader2 size={14} className="mr-2 animate-spin" />
                    Generating...
                  </>
                ) : isPlaying ? (
                  'Stop'
                ) : (
                  'Listen'
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ReviewAudio;
