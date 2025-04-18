
import React from 'react';
import { Check, X, CircleDot } from 'lucide-react';

type SentimentType = 'positive' | 'negative' | 'neutral';

interface SentimentTagProps {
  sentiment: SentimentType;
  className?: string;
}

const SentimentTag = ({ sentiment, className = '' }: SentimentTagProps) => {
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
      {getIcon()}
      <span className="capitalize">{sentiment}</span>
    </span>
  );
};

export default SentimentTag;
