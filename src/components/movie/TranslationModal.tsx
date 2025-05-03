
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X, Check } from 'lucide-react';
import LanguageSelector, { LANGUAGES } from '../translation/LanguageSelector';
import TranslatedContent from '../translation/TranslatedContent';
import { useTranslation } from '@/hooks/useTranslation';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';

interface TranslationModalProps {
  text: string;
  onClose: () => void;
  onSelect: (translatedText: string) => void;
  isReadOnly?: boolean;
}

const TranslationModal = ({ text, onClose, onSelect, isReadOnly = false }: TranslationModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [targetLanguage, setTargetLanguage] = useState('es');
  
  // Use our custom hooks
  const { translatedText, isLoading } = useTranslation(text, targetLanguage);
  const { isPlaying, speak, stopSpeaking } = useTextToSpeech();

  const handleClose = () => {
    stopSpeaking();
    setIsOpen(false);
    onClose();
  };

  const handleUseTranslation = () => {
    onSelect(translatedText);
    handleClose();
  };

  const handleSpeakTranslation = () => {
    speak(translatedText || text, targetLanguage);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-movie-dark border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Translate Review</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-white/70">Translate to:</p>
            <LanguageSelector 
              value={targetLanguage}
              onChange={setTargetLanguage}
              className="w-[180px]"
            />
          </div>

          <TranslatedContent
            originalText={text}
            translatedText={translatedText}
            isLoading={isLoading}
            onSpeakClick={handleSpeakTranslation}
            isPlaying={isPlaying}
          />
        </div>
        
        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={handleClose}>
            <X size={14} className="mr-1" /> Close
          </Button>
          {!isReadOnly && (
            <Button 
              onClick={handleUseTranslation}
              disabled={isLoading || !translatedText}
            >
              <Check size={14} className="mr-1" /> Use Translation
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TranslationModal;
