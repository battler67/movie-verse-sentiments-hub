
import { useState } from 'react';

type SentimentType = 'positive' | 'negative' | 'neutral';

export const useReviewFilters = (reviews: any[]) => {
  const [selectedSentiment, setSelectedSentiment] = useState<SentimentType | null>(null);

  const filteredReviews = selectedSentiment
    ? reviews.filter(r => r.sentiment === selectedSentiment)
    : reviews;

  const resetFilter = () => setSelectedSentiment(null);

  return {
    selectedSentiment,
    setSelectedSentiment,
    filteredReviews,
    resetFilter
  };
};
