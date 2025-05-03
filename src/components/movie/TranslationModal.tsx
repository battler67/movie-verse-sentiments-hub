
import React, { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Headphones, X, Check } from 'lucide-react';
import { toast } from 'sonner';

interface TranslationModalProps {
  text: string;
  onClose: () => void;
  onSelect: (translatedText: string) => void;
  isReadOnly?: boolean;
}

interface Language {
  code: string;
  name: string;
}

const LANGUAGES: Language[] = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'it', name: 'Italian' },
  { code: 'zh', name: 'Chinese' },
  { code: 'ja', name: 'Japanese' },
  { code: 'ko', name: 'Korean' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ru', name: 'Russian' }
];

const TranslationModal = ({ text, onClose, onSelect, isReadOnly = false }: TranslationModalProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const [targetLanguage, setTargetLanguage] = useState('es');
  const [translatedText, setTranslatedText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (text && targetLanguage) {
      translateText();
    }
  }, [targetLanguage]);

  const translateText = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, we're simulating translation
      // In a real app, you would call an external translation API or a Supabase Edge Function
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockTranslations: Record<string, string> = {
        'es': '¡Esta película fue increíble! La cinematografía y la actuación fueron excelentes.',
        'fr': 'Ce film était incroyable! La cinématographie et le jeu d\'acteur étaient excellents.',
        'de': 'Dieser Film war unglaublich! Die Kameraführung und das Schauspiel waren ausgezeichnet.',
        'it': 'Questo film è stato incredibile! La cinematografia e la recitazione sono state eccellenti.',
        'zh': '这部电影太棒了！摄影和表演都很出色。',
        'ja': 'この映画は素晴らしかった！撮影と演技は素晴らしかった。',
        'ko': '이 영화는 놀라웠어요! 촬영과 연기가 훌륭했어요.',
        'ar': 'كان هذا الفيلم مذهلاً! كانت التصوير السينمائي والتمثيل ممتازين.',
        'hi': 'यह फिल्म अद्भुत थी! सिनेमैटोग्राफी और अभिनय उत्कृष्ट थे।',
        'ru': 'Этот фильм был потрясающим! Кинематография и актерская игра были превосходны.'
      };
      
      const result = mockTranslations[targetLanguage] || text;
      setTranslatedText(result);
    } catch (error) {
      console.error("Translation error:", error);
      toast.error("Failed to translate text");
      setTranslatedText("");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (audio) {
      audio.pause();
    }
    setIsOpen(false);
    onClose();
  };

  const handleUseTranslation = () => {
    onSelect(translatedText);
    handleClose();
  };

  const handleSpeakTranslation = async () => {
    if (isPlaying && audio) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    try {
      setIsPlaying(true);
      toast.loading("Generating speech...");
      
      try {
        const { data, error } = await supabase.functions.invoke("text-to-speech", {
          body: { 
            text: translatedText || text,
            language: targetLanguage
          }
        });

        if (error) throw error;

        if (data && data.audioContent) {
          // Create audio from base64
          const audioBlob = base64ToBlob(data.audioContent, 'audio/mp3');
          const audioUrl = URL.createObjectURL(audioBlob);
          
          if (audio) {
            audio.pause();
            URL.revokeObjectURL(audio.src);
          }

          const newAudio = new Audio(audioUrl);
          setAudio(newAudio);
          
          newAudio.onended = () => {
            setIsPlaying(false);
          };
          
          newAudio.play();
          toast.dismiss();
          toast.success("Playing audio");
        }
      } catch (error) {
        console.error("Text-to-speech API error:", error);
        
        // Fallback to browser's speech synthesis
        if ('speechSynthesis' in window) {
          speechSynthesis.cancel(); // Cancel any ongoing speech
          const utterance = new SpeechSynthesisUtterance(translatedText || text);
          utterance.lang = targetLanguage;
          
          utterance.onend = () => {
            setIsPlaying(false);
          };
          
          speechSynthesis.speak(utterance);
          toast.dismiss();
        } else {
          toast.error("Your browser doesn't support speech synthesis");
          setIsPlaying(false);
        }
      }
    } catch (error) {
      console.error("Text-to-speech error:", error);
      setIsPlaying(false);
      toast.dismiss();
      toast.error("Failed to generate speech");
    }
  };

  // Helper function to convert base64 to Blob
  const base64ToBlob = (base64: string, mimeType: string) => {
    const byteCharacters = atob(base64);
    const byteArrays = [];
    for (let i = 0; i < byteCharacters.length; i += 512) {
      const slice = byteCharacters.slice(i, i + 512);
      const byteNumbers = new Array(slice.length);
      for (let j = 0; j < slice.length; j++) {
        byteNumbers[j] = slice.charCodeAt(j);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, { type: mimeType });
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-movie-dark border-white/10 text-white max-w-md">
        <DialogHeader>
          <DialogTitle>Translate Review</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 my-4">
          <div className="space-y-2">
            <p className="text-sm text-white/70">Original text:</p>
            <div className="p-3 bg-movie-darker rounded-md text-sm">{text}</div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-sm text-white/70">Translate to:</p>
              <Select
                value={targetLanguage}
                onValueChange={setTargetLanguage}
              >
                <SelectTrigger className="w-[180px] bg-movie-darker border-white/10">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-movie-darker border-white/10">
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="relative">
              <div className="p-3 bg-movie-darker rounded-md text-sm min-h-[100px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></div>
                  </div>
                ) : translatedText}
              </div>
              
              {translatedText && !isLoading && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 h-6 w-6"
                  onClick={handleSpeakTranslation}
                >
                  <Headphones 
                    size={14} 
                    className={isPlaying ? "text-movie-primary animate-pulse" : "text-white/70"} 
                  />
                </Button>
              )}
            </div>
          </div>
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
