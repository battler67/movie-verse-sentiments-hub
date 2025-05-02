
import { useState, useEffect } from 'react';
import { getMovieReviews } from '@/services/review/getReviews';
import { analyzeSentiment, deduplicateReviews } from '@/services/sentimentAnalysis';
import { toast } from 'sonner';

export const useReviewManagement = (movieId: string) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      setIsLoading(true);
      try {
        // First deduplicate reviews
        const removedCount = await deduplicateReviews(movieId);
        if (removedCount > 0) {
          toast.info(`Cleaned up ${removedCount} duplicate ${removedCount === 1 ? 'review' : 'reviews'}`);
        }
        
        // Then load the reviews
        const reviewData = await getMovieReviews(movieId);
        
        // Mark reviews as analyzing initially if they don't have sentiment
        const reviewsWithAnalysis = reviewData.map(review => ({
          ...review,
          isAnalyzing: !review.sentiment
        }));
        
        setReviews(reviewsWithAnalysis);
        
        // Process reviews that don't have sentiment analysis yet
        for (let i = 0; i < reviewsWithAnalysis.length; i++) {
          const review = reviewsWithAnalysis[i];
          if (!review.sentiment && review.review_text) {
            try {
              console.log(`Analyzing sentiment for review ${i}`);
              
              // Update UI to show analyzing state
              setReviews(prevReviews => {
                const updatedReviews = [...prevReviews];
                updatedReviews[i] = {
                  ...updatedReviews[i],
                  isAnalyzing: true
                };
                return updatedReviews;
              });
              
              const result = await analyzeSentiment(review.review_text);
              
              setReviews(prevReviews => {
                const updatedReviews = [...prevReviews];
                updatedReviews[i] = {
                  ...updatedReviews[i],
                  sentiment: result.sentiment,
                  confidence: result.confidence,
                  isAnalyzing: false
                };
                return updatedReviews;
              });
            } catch (error) {
              console.error(`Error analyzing sentiment for review ${i}:`, error);
              setReviews(prevReviews => {
                const updatedReviews = [...prevReviews];
                updatedReviews[i] = {
                  ...updatedReviews[i],
                  sentiment: 'neutral',
                  confidence: 0,
                  isAnalyzing: false
                };
                return updatedReviews;
              });
            }
          }
        }
      } catch (error) {
        console.error("Error loading reviews:", error);
        toast.error("Failed to load reviews");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReviews();
  }, [movieId]);

  return { reviews, setReviews, isLoading };
};
