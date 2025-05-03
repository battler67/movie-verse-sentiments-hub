
import React from 'react';
import { Button } from '@/components/ui/button';
import { Headphones } from 'lucide-react';

interface TranslatedContentProps {
  originalText: string;
  translatedText: string;
  isLoading: boolean;
  onSpeakClick: () => void;
  isPlaying: boolean;
}

const TranslatedContent: React.FC<TranslatedContentProps> = ({
  originalText,
  translatedText,
  isLoading,
  onSpeakClick,
  isPlaying
}) => {
  return (
    <div className="space-y-4 my-4">
      <div className="space-y-2">
        <p className="text-sm text-white/70">Original text:</p>
        <div className="p-3 bg-movie-darker rounded-md text-sm">{originalText}</div>
      </div>
      
      <div className="space-y-2 relative">
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
            onClick={onSpeakClick}
            title={isPlaying ? "Stop playing" : "Listen to translation"}
          >
            <Headphones 
              size={14} 
              className={isPlaying ? "text-movie-primary animate-pulse" : "text-white/70"} 
            />
          </Button>
        )}
      </div>
    </div>
  );
};

export default TranslatedContent;
