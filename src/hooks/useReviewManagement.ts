
import { useState, useEffect, useCallback } from 'react';
import { getMovieReviews } from '@/services/review/getReviews';
import { analyzeSentiment } from '@/services/sentimentAnalysis';
import { toast } from 'sonner';

export const useReviewManagement = (movieId: string) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Memoize loadReviews to prevent unnecessary recreations
  const loadReviews = useCallback(async () => {
    setIsLoading(true);
    try {
      // Load the reviews
      const reviewData = await getMovieReviews(movieId);
      
      // Process reviews in batches for better performance
      const batchSize = 5;
      const reviewsWithAnalysis = [...reviewData];
      
      // First render all reviews, then analyze those without sentiment in background
      setReviews(reviewsWithAnalysis);
      setIsLoading(false);
      
      // Background process for sentiment analysis
      const reviewsNeedingAnalysis = reviewsWithAnalysis
        .map((review, index) => ({ review, index }))
        .filter(({ review }) => !review.sentiment && review.review_text);
      
      // Process in small batches to avoid overloading the browser
      for (let i = 0; i < reviewsNeedingAnalysis.length; i += batchSize) {
        const batch = reviewsNeedingAnalysis.slice(i, i + batchSize);
        
        // Process batch in parallel
        await Promise.all(batch.map(async ({ review, index }) => {
          try {
            console.log(`Analyzing sentiment for review ${index}`);
            
            setReviews(prevReviews => {
              const updatedReviews = [...prevReviews];
              updatedReviews[index] = {
                ...updatedReviews[index],
                isAnalyzing: true
              };
              return updatedReviews;
            });
            
            const result = await analyzeSentiment(review.review_text);
            
            setReviews(prevReviews => {
              const updatedReviews = [...prevReviews];
              updatedReviews[index] = {
                ...updatedReviews[index],
                sentiment: result.sentiment,
                confidence: result.confidence,
                isAnalyzing: false
              };
              return updatedReviews;
            });
          } catch (error) {
            console.error(`Error analyzing sentiment for review ${index}:`, error);
            setReviews(prevReviews => {
              const updatedReviews = [...prevReviews];
              updatedReviews[index] = {
                ...updatedReviews[index],
                sentiment: 'neutral',
                confidence: 0,
                isAnalyzing: false
              };
              return updatedReviews;
            });
          }
        }));
        
        // Small delay between batches to avoid UI freezing
        if (i + batchSize < reviewsNeedingAnalysis.length) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
    } catch (error) {
      console.error("Error loading reviews:", error);
      toast.error("Failed to load reviews");
      setIsLoading(false);
    }
  }, [movieId]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  return { reviews, setReviews, isLoading, refreshReviews: loadReviews };
};
