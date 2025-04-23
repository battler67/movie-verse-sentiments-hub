
import React from 'react';
import { Check, X, CircleDot } from 'lucide-react';

type SentimentType = 'positive' | 'negative' | 'neutral';

interface SentimentTagProps {
  sentiment: SentimentType;
  confidence?: number;
  isAnalyzing?: boolean;
  className?: string;
}

const SentimentTag = ({ sentiment, confidence, isAnalyzing = false, className = '' }: SentimentTagProps) => {
  const getIcon = () => {
    switch (sentiment) {
      case 'positive':
        return <Check size={12} />;
      case 'negative':
        return <X size={12} />;
      case 'neutral':
        return <CircleDot size={12} />;
    }
  };

  return (
    <span className={`sentiment-tag sentiment-${sentiment} flex items-center space-x-1 ${className}`}>
      {isAnalyzing ? (
        <>
          <span className="text-xs animate-pulse">Analyzing review...</span>
        </>
      ) : (
        <>
          {getIcon()}
          <span className="capitalize">{sentiment}</span>
          {confidence !== undefined && (
            <span className="text-xs opacity-80 ml-1">({confidence}%)</span>
          )}
        </>
      )}
    </span>
  );
};

export default SentimentTag;
