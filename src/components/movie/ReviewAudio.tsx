
import React, { useState, useEffect } from 'react';
import { Headphones, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import LanguageSelector from '@/components/translation/LanguageSelector';
import { toast } from 'sonner';

interface ReviewAudioProps {
  text: string;
  language?: string;
}

const ReviewAudio: React.FC<ReviewAudioProps> = ({ text, language = 'en-US' }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEmptyDialog, setShowEmptyDialog] = useState(false);
  const [showLanguageDialog, setShowLanguageDialog] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(language);
  const [currentUtterance, setCurrentUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      if (window.speechSynthesis && isPlaying) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isPlaying]);

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

  const stopSpeaking = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
    }
    
    if (currentUtterance) {
      setCurrentUtterance(null);
    }
  };

  const handleSpeakInLanguage = () => {
    if (!window.speechSynthesis) {
      toast.error("Your browser doesn't support speech synthesis");
      return;
    }

    // Stop any current speech
    stopSpeaking();
    
    try {
      setIsGenerating(true);
      
      // Create a new utterance
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage;
      
      // Try to find a matching voice for the language
      const voices = window.speechSynthesis.getVoices();
      const exactVoiceMatch = voices.find(voice => voice.lang === selectedLanguage);
      const languageMatch = voices.find(voice => voice.lang.startsWith(selectedLanguage.split('-')[0]));
      
      // Use exact match, language match, or default voice
      if (exactVoiceMatch) {
        utterance.voice = exactVoiceMatch;
      } else if (languageMatch) {
        utterance.voice = languageMatch;
      }
      
      // Handle events
      utterance.onstart = () => {
        setIsPlaying(true);
        setIsGenerating(false);
        toast.success(`Playing in ${utterance.voice?.name || selectedLanguage}`);
      };
      
      utterance.onend = () => {
        setIsPlaying(false);
      };
      
      utterance.onerror = (event) => {
        console.error("Speech synthesis error:", event);
        setIsPlaying(false);
        setIsGenerating(false);
        toast.error("Failed to play speech");
      };
      
      // Start speaking
      setCurrentUtterance(utterance);
      window.speechSynthesis.speak(utterance);
      
      // Close the language selection dialog
      setShowLanguageDialog(false);
      
    } catch (error) {
      console.error("Text-to-speech error:", error);
      setIsGenerating(false);
      toast.error("Failed to generate speech");
    }
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
              speechSynthesisMode={true}
            />
            <div className="flex justify-end pt-2">
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
