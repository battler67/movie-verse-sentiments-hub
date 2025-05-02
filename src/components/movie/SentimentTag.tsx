
import React from 'react';
import { Check, X, CircleDot, Loader2 } from 'lucide-react';

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
        return <Check size={12} className="text-green-500" />;
      case 'negative':
        return <X size={12} className="text-red-500" />;
      case 'neutral':
        return <CircleDot size={12} className="text-yellow-500" />;
    }
  };

  const getTagColor = () => {
    switch (sentiment) {
      case 'positive':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'negative':
        return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'neutral':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    }
  };

  const getConfidenceLabel = () => {
    if (confidence === undefined || confidence === null) return '';
    if (confidence >= 80) return 'High';
    if (confidence >= 50) return 'Medium';
    return 'Low';
  };

  // Format confidence to 2 decimal places if available
  const formatConfidence = () => {
    if (confidence === undefined || confidence === null) return '';
    return confidence.toFixed(2);
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs border ${getTagColor()} ${className}`}>
      {isAnalyzing ? (
        <>
          <Loader2 size={12} className="mr-1 animate-spin" />
          <span>Analyzing...</span>
        </>
      ) : (
        <>
          <span className="mr-1">{getIcon()}</span>
          <span className="capitalize">{sentiment}</span>
          {confidence !== undefined && confidence > 0 && (
            <span className="ml-1 opacity-80">
              ({getConfidenceLabel()} {formatConfidence()}%)
            </span>
          )}
        </>
      )}
    </span>
  );
};

export default SentimentTag;
