
import React, { useState } from 'react';
import { User, Star, Calendar, Headphones } from 'lucide-react';
import SentimentTag from './SentimentTag';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type SentimentType = 'positive' | 'negative' | 'neutral';

interface ReviewCardProps {
  username: string;
  date: string;
  rating: number;
  comment: string;
  sentiment: SentimentType;
  confidence?: number;
  isAnalyzing?: boolean;
  language?: string;
}

const ReviewCard = ({ 
  username, 
  date, 
  rating, 
  comment, 
  sentiment, 
  confidence, 
  isAnalyzing = false,
  language = 'en' 
}: ReviewCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const handleTextToSpeech = async () => {
    try {
      if (isPlaying && audio) {
        audio.pause();
        setIsPlaying(false);
        return;
      }

      setIsPlaying(true);
      toast.loading("Generating speech...");

      const { data, error } = await supabase.functions.invoke("text-to-speech", {
        body: { 
          text: comment,
          language: language || 'en'
        }
      });

      if (error) throw error;

      if (data && data.audioContent) {
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
      }
    } catch (error) {
      console.error("Text-to-speech error:", error);
      setIsPlaying(false);
      toast.error("Failed to generate speech");
    }
  };

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
    <div className="w-full">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-full bg-movie-primary/20 flex items-center justify-center">
          <User size={14} className="text-movie-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center flex-wrap gap-2">
            <h4 className="text-sm font-medium">{username}</h4>
            <SentimentTag 
              sentiment={sentiment} 
              confidence={confidence} 
              isAnalyzing={isAnalyzing}
            />
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handleTextToSpeech}
              title="Listen to this review"
            >
              <Headphones 
                size={14} 
                className={isPlaying ? "text-movie-primary animate-pulse" : "text-white/70"} 
              />
            </Button>
          </div>
          <div className="flex items-center space-x-2 mt-0.5">
            <div className="flex items-center text-yellow-400">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={12}
                  fill={i < rating ? "currentColor" : "none"}
                  stroke={i < rating ? "currentColor" : "currentColor"}
                  className="mr-0.5"
                />
              ))}
            </div>
            <span className="text-xs text-white/60 flex items-center">
              <Calendar size={10} className="mr-1" />
              {date}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-sm text-white/80 leading-relaxed">{comment}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
