
import React from 'react';
import { User, Star, Calendar } from 'lucide-react';
import SentimentTag from './SentimentTag';
import ReviewAudio from './ReviewAudio';

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
            <ReviewAudio 
              text={comment}
              language={language}
            />
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
